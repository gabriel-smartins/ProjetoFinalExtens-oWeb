import React from "react";
import Main from "../template/main";
import axios from "axios";

const headerProps = {
  icon: "shopping-cart",
  title: "Pedidos",
  subtitle: "Cadastro de pedidos: descrição, marca, preço, etc.",
};

const baseUrl = "http://localhost:3001/order";
const initState = {
  order: {
    name: "",
    brand: "",
    category: "Moto",
    price: "",
    quantity: "",
    store: "",
    manager: "",
  },
  list: [],
  employees: []
};

export default class OrderCrud extends React.Component {
  state = { ...initState };

  componentWillMount() {
    axios.get(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
    axios.get("http://localhost:3001/employee").then((resp) => {
        this.setState({ employees: resp.data });
    });
  }

  clear() {
    this.setState({ order: initState.order });
  }

  save() {
    const order = this.state.order;

    // Validação para campos obrigatórios
    if (!order.name || !order.brand || !order.category || !order.price || !order.quantity) {
        alert("Preencha todos os campos obrigatórios antes de salvar.");
        return;
    }

    const method = order.id ? "put" : "post";
    const url = order.id ? `${baseUrl}/${order.id}` : baseUrl;

    axios[method](url, order).then((resp) => {
      const updatedOrder = resp.data;
      const list = this.getUpdatedList(updatedOrder); // Atualiza a lista
      this.setState({ order: initState.order, list }); // Atualiza o estado com a lista corrigida

      if (order.id) {
          alert("Pedido atualizado com sucesso! Por favor recarregue a página");
      } else {
          alert("Pedido salvo com sucesso!");
      }
  }).catch((error) => {
      console.error("Erro ao salvar/atualizar o pedido:", error);
      alert("Erro ao salvar/atualizar o pedido. Tente novamente.");
  });
}


getUpdatedList(order, add = true) {
  const list = this.state.list.filter((u) => u.id !== order.id); 
  if (add) list.unshift(order); 
  return list;
}


  updateField(event) {
    const order = { ...this.state.order };
    order[event.target.name] = event.target.value;
    this.setState({ order });
  }

  load(order) {
    this.setState({ order });
  }

  remove(order) {
    axios.delete(`${baseUrl}/${order.id}`).then(() => {
      const list = this.state.list.filter((o) => o !== order);
      this.setState({ list });
    });
  }


  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.order.name}
                onChange={(e) => this.updateField(e)}
                placeholder="Descrição.."
              />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                className="form-control"
                name="brand"
                value={this.state.order.brand}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite a marca"
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select
                className="form-control"
                name="category"
                value={this.state.order.category}
                onChange={(e) => this.updateField(e)}
              >
                <option value="moto">Moto</option>
              </select>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label>Preço</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={this.state.order.price}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o preço.."
              />
            </div>
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={this.state.order.quantity}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite a quantidade.."
              />
            </div>
            <div className="form-group">
              <label>Loja</label>
              <input
                type="text"
                className="form-control"
                name="store"
                value={this.state.order.store}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite a loja.."
              />
            </div>
            <div className="form-group">
              <label>Encarregado</label>
              <select
                className="form-control"
                name="manager"
                value={this.state.order.manager}
                onChange={(e) => this.updateField(e)}
              >
                <option value="">Selecione um encarregado..</option>
                {this.state.employees.map((employee) => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => this.save()}>
              Salvar
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => this.clear()}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Marca</th>
            <th>Loja</th>
            <th>Encarregado</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

 
  renderRows() {
    return this.state.list.map((order) => (
      <tr key={order.id}>
        <td>{order.name}</td>
        <td>{order.brand}</td>
        <td>{order.store}</td>
        <td>{order.manager}</td>
        <td>{new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(order.price)}</td>
        <td>{order.quantity}</td>
        <td>{new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(order.price * order.quantity)}</td>
        <td>
          <button
            className="btn btn-warning mr-2"
            onClick={() => this.load(order)}
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button className="btn btn-danger" onClick={() => this.remove(order)}>
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
