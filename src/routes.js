import React from "react";
import {
    Route,
    Switch
} from "react-router-dom";

import Login from './components/auth/login';
import Register from './components/auth/register';
import PasswordReset from './components/auth/passwordReset';
import ResetPassword from './components/auth/resetPassword';
import RegisterAdmin from './components/admin/registerAdmin';
import AdminDashBoard from './components/admin/adminDashboard';
import UserProfile from './components/auth/profile';
import ProtectedRoute from './protectedRoutes'
import NotFound from './components/common/404page'


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/admin/register" component={RegisterAdmin} />
            <ProtectedRoute exact path="/admin/dashboard" component={AdminDashBoard} />
            <ProtectedRoute exact path="/staff/dashboard/users/profile/:userId" component={UserProfile} />
            <Route exact path="/password-reset-request" component={PasswordReset} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route path="*" component={NotFound} />
        </Switch>
    </div>
);

export default BaseRouter;
