import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Container,
    Header,
    Tab,
    Form,
    Message,
    Divider,
} from 'semantic-ui-react';
import PhoneInput from "react-phone-input-2";
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../../context/auth';

import '../root.scss';

function RegisterAdmin(props) {
    const [errors, setErrors] = useState({});
    const context = useContext(AuthContext);

    const [values, setValues] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, result) {
            context.registerAdmin(result.data);
            console.log("response", result.data.createAdmin.message);
            props.history.push({
                pathname: '/',
                state: { systemAlert: result.data.createAdmin.message }
            })
        },
        onError(err) {
            try {

                if (err.networkError !== null && err.networkError !== 'undefined') {

                    setErrors(err.networkError.result.errors[0]);

                } else if (err.graphQLErrors !== null && err.networkError !== 'undefined') {

                    setErrors(err.graphQLErrors.result.errors[0]);

                }
            } catch (e) {
                setErrors(err);
            }

        },
        variables: values
    });

    const onChange = (event, { name, value }) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }
    const onPhoneNumberChange = value => {
        setValues({ ...values, phoneNumber: "+" + value });
    }
    

    const [visible, setVisible] = useState(false);

    const handleDismiss = () => {
        setVisible(false)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        errors.message = "";
        setVisible(true);
        addUser();
    }


    const panes = [
        {
            menuItem: 'Admin Registration',
            render: () =>

                <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                    <Divider horizontal>Personal Information</Divider>

                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid label='Username'
                            placeholder='Username'
                            name='username'
                            value={values.username}
                            onChange={onChange}
                        />

                        <Form.Input
                            fluid label='First name'
                            placeholder='First name'
                            name='firstName'
                            value={values.firstName}
                            onChange={onChange}
                        />

                        <Form.Input
                            fluid label='Last name'
                            placeholder='Last name'
                            name='lastName'
                            value={values.lastName}
                            onChange={onChange}
                        />
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid label='Password'
                            placeholder='Password'
                            name='password'
                            value={values.password}
                            onChange={onChange}
                            type='password'
                        />

                        <Form.Input
                            fluid label='Email'
                            placeholder='Email Address'
                            name='email'
                            value={values.email}
                            onChange={onChange}
                        />
                        <Form.Field>

                            <PhoneInput
                                inputExtraProps={{
                                    name: "phoneNumber",
                                    required: true,
                                    autoFocus: true,
                                    enableSearch: true
                                }}
                                name='phoneNumber'
                                specialLabel='Phone Number'
                                country={"ke"}
                                value={values.phoneNumber}
                                onChange={onPhoneNumberChange}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Checkbox label='I agree to the Terms and Conditions' />
                    <Form.Button secondary>Register Admin</Form.Button>
                </Form>,
        },
    ];

    return (
        <div className='.app-container'>
            <Container>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>Sign Up</Header>
                            <div className='center'>
                                Already got an account?
                            <Link to="/"> Sign In Here</Link>
                            </div>

                            <Tab className='clear-top' menu={{ secondary: true, pointing: true }} panes={panes} />

                            {visible ?
                                <Message
                                    onDismiss={handleDismiss}
                                    header='System Response'
                                    content={errors ? errors.message : ''}
                                />
                                :
                                ''

                            }

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
}

const REGISTER_USER = gql`
mutation createAdmin(
    $username: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $email: String!
    $phoneNumber: String!
) {
  createAdmin(
  admin:{
    username: $username
    password: $password
    email: $email
    firstName: $firstName
    lastName: $lastName
    phoneNumber: $phoneNumber
   image:"https://res.cloudinary.com/dsw3onksq/image/upload/v1592728825/user_x89zcm.png"
  }
  ){
    status
    message
    admin {
      id
      username
      email
      firstName
      isSuperuser
      isActive
      isStaff
      image
      phoneNumber
      roles
    }
  }
}
`
export default RegisterAdmin;
