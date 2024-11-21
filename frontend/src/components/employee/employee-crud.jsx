import React from "react";
import Main from "../template/main";
import axios from "axios";

const headerProps = {
  icon: "users",
  title: "Funcionários",
  subtitle: "Cadastro de funcionários",
};

const baseUrl = "http://localhost:3001/employee";
const initState = {
  employee: { name: "", email: "" },
  list: [],
};

export default class EmployeeCrud extends React.Component {
  state = { ...initState };

  componentDidMount() {
    axios.get(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ employee: initState.employee });
  }

  save() {
    const employee = this.state.employee;
    const method = employee.id ? "put" : "post";
    const url = employee.id ? `${baseUrl}/${employee.id}` : baseUrl;
  
    axios[method](url, employee)
      .then((resp) => {
        const updatedEmployee = resp.data;
        const list = this.getUpdatedList(updatedEmployee); // Atualiza a lista
        this.setState({ employee: initState.employee, list }); // Limpa o formulário e atualiza a lista
  
        alert(employee.id 
          ? "Funcionário atualizado com sucesso! Por favor recarregue a página." 
          : "Funcionário cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar/atualizar o funcionário:", error);
        alert("Erro ao salvar/atualizar o funcionário. Tente novamente.");
      });
  }
  

  getUpdatedList(employee) {
    const list = this.state.list.filter((u) => u.id !== employee.id);
    list.unshift(employee);
    return list;
  }

  updateField(event) {
    const employee = { ...this.state.employee };
    employee[event.target.name] = event.target.value;
    this.setState({ employee });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.employee.name}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o nome.."
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={this.state.employee.email}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o email.."
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => this.save()}>
              Salvar
            </button>
            <button className="btn btn-secondary ml-2" onClick={() => this.clear()}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  load(employee) {
    this.setState({ employee });
  }

  remove(employee) {
    axios.delete(`${baseUrl}/${employee.id}`).then(() => {
      const list = this.state.list.filter((u) => u.id !== employee.id);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((employee) => {
      return (
        <tr key={employee.id}>
          <td>{employee.name}</td>
          <td>{employee.email}</td>
          <td>
            <button
              className="btn btn-warning mr-2"
              onClick={() => this.load(employee)}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.remove(employee)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
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
