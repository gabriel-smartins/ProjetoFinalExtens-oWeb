import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/home'
import EmployeeCrud from '../components/employee/employee-crud'
import OrderCrud from '../components/orders/orders-crud';

export default props =>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={EmployeeCrud} />
        <Route exact path="/orders" component={OrderCrud} />
        <Redirect from="*" to="/" />
    </Switch>


