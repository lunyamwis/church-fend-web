import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
    Grid,
    Container,
    Header,
    Tab,
    Form,
    Message,
    Image,
    Loader,
    Button,
    Icon,
    Pagination
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../../context/auth';

import '../root.scss';
import PhoneInput from 'react-phone-input-2';

function AdminDashBoard({ props }) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    let userInfo = context.user
    // console.log(props)
    // if (userInfo.roles && userInfo.roles[0] === "manager") {
    //     props.history.push("/staff/dashboard/overview");
    // }
    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        search: ""
    });
    let count = 1;

    const [values, setValues] = useState({
        staffUsername: "",
        staffPassword: "",
        staffEmail: "",
        staffFirstName: "",
        staffLastName: "",
        staffPhoneNumber: ""
    })

    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState({});

    const handleDismiss = () => {
        setVisible(false)
    }

    const [message, setMessage] = useState({});

    const [addUser, { loading }] = useMutation(REGISTER_STAFF, {
        update(_, result) {
            context.registerStaff(result.data);
            const response = result.data.createUser.user.username;
            console.log("made user", response);
            let successMessage = `Staff ${response} has been created successfully. Please instruct them to verify their account before use.`;
            setMessage(successMessage);
            console.log("message", message);

            values.staffUsername = "";
            values.staffPassword = "";
            values.staffEmail = "";
            values.staffFirstName = "";
            values.staffLastName = "";
            values.staffPhoneNumber = "";
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

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }
    const onPhoneNumberChange = useCallback((value) => {
        setValues({ ...values, staffPhoneNumber: "+" + value, updated: true });
    }, [values])
    const onSubmit = (event) => {
        event.preventDefault();
        errors.message = "";
        addUser();
        setVisible(true);
    }


    const { loading: usersLoading, data: usersData } = useQuery(FETCH_USERS_QUERY,
        { variables: pagination });
    useEffect(() => {
        if (usersData) {
            setUsers(usersData.users)
        }
    }, [usersData])

    const handleOnPageChange = (e, data) => {
        e.preventDefault()
        setPagination({ ...pagination, page: data.activePage })
    }
    const handleOnSearch = (e) => {
        e.preventDefault()
        setPagination({ ...pagination, search: e.target.value })

    }
    const panes = [
        {
            menuItem: 'Staff',
            render: () =>
                <div> {usersLoading ?
                    <Loader active />
                    :
                    users && users.count === 0 ? <Message
                        onDismiss={handleDismiss}
                        content={'No Staff members in the Database.'}
                    /> : <Grid container columns={4} className={loading ? "loading" : ''}>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header as="h4">Name</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as="h4">Email</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as="h4">Phone Number</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as="h4">Join Date</Header>
                                </Grid.Column>
                            </Grid.Row>
                            {users.items && users.items.map(client =>
                                <Grid.Row key={client.id}>
                                    <Grid.Column>
                                        <span>{count++}. </span>
                                        <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
                                        <span style={{ textTransform: 'titlecase' }}>{client.firstName} {client.lastName}</span>
                                    </Grid.Column>
                                    <Grid.Column>
                                        {client.email}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {client.phoneNumber}
                                    </Grid.Column>
                                    <Grid.Column>

                                        <Grid>

                                            <Grid.Column floated='left' width={3}>
                                                {moment(client.createdAt).format('DD/MM/YYYY')}
                                            </Grid.Column>
                                            <Grid.Column width={1} floated='left'>
                                                <Link to={`/staff/dashboard/users/profile/${client.id}`}>
                                                    <Button icon >
                                                        <Icon name='external alternate' />
                                                    </Button>
                                                </Link>
                                            </Grid.Column>
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>)}

                        </Grid>

                }
                    {users.page && <Pagination
                        defaultActivePage={users.page}
                        firstItem={null}
                        lastItem={null}
                        pointing
                        secondary
                        onPageChange={handleOnPageChange}
                        totalPages={users.pages}
                    />}


                </div>

        },
        {
            menuItem: 'Add new Staff',
            render: () =>

                <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>


                    <p as='h4' className="float-left">Personal Information</p>
                    <Form.Group widths='equal'>

                        <Form.Input
                            fluid label='Username'
                            placeholder='Username'
                            name='staffUsername'
                            value={values.staffUsername}
                            onChange={onChange}
                            id="username"
                            errors={errors.staffUsername ? true : undefined}
                        />

                        <Form.Input
                            fluid label='First name'
                            placeholder='First name'
                            name='staffFirstName'
                            value={values.staffFirstName}
                            onChange={onChange}
                            errors={errors.staffFirstName ? true : undefined}

                        />

                        <Form.Input
                            fluid label='Last name'
                            placeholder='Last name'
                            name='staffLastName'
                            value={values.staffLastName}
                            onChange={onChange}
                            errors={errors.staffLastName ? true : undefined}

                        />
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid label='Password'
                            placeholder='Password'
                            name='staffPassword'
                            value={values.staffPassword}
                            onChange={onChange}
                            errors={errors.staffPassword ? true : undefined}
                            type='password'

                        />

                        <Form.Input
                            fluid label='Email'
                            placeholder='Email Address'
                            name='staffEmail'
                            value={values.staffEmail}
                            onChange={onChange}
                            errors={errors.staffEmail ? true : undefined}

                        />
                        <Form.Field>

                            <PhoneInput
                                inputExtraProps={{
                                    name: "phoneNumber",
                                    required: true,
                                    autoFocus: true,
                                    enableSearch: true
                                }}
                                style={{ fontWeight: "bold" }}
                                name='phoneNumber'
                                specialLabel='Phone Number *'
                                country={"ke"}
                                value={values.staffPhoneNumber}
                                onChange={onPhoneNumberChange}
                            />
                        </Form.Field>

                        <Form.Input
                            fluid label='Phone Number'
                            placeholder='Phone number'
                            name='staffPhoneNumber'
                            value={values.staffPhoneNumber}
                            onChange={onChange}
                            errors={errors.staffPhoneNumber ? true : undefined}

                        />

                    </Form.Group>

                    <Form.Checkbox label='I agree to the Terms and Conditions' />
                    <Form.Button secondary>Register Staff</Form.Button>
                </Form >
        },

    ];


    return (
        <div className='app-container'>
            <Container>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h3' className="float-left">Hi there, {userInfo.username} </Header>
                            <div>
                                Welcome to your admin account.
                        </div>
                            <Grid container columns={1} padded>
                                <Grid.Column>
                                    <Form>
                                        <Form.Group>
                                            <Form.Input
                                                placeholder='Name, Phone number...'
                                                name='name'
                                                onChange={handleOnSearch}
                                            />
                                            <Form.Button icon size={'medium'} onClick={(e) => { e.preventDefault() }}>
                                                <Icon name="search" />
                                                Find Staff
                                            </Form.Button>
                                        </Form.Group>
                                    </Form>
                                </Grid.Column>
                            </Grid>

                            <Tab className='clear-top' menu={{ secondary: true, pointing: true }} panes={panes} />


                            {visible ?
                                <Message
                                    onDismiss={handleDismiss}
                                    content={errors ? errors.message : '' && message ? message : ''}
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

const REGISTER_STAFF = gql`
mutation createUser (
    $staffUsername: String!
    $staffPassword: String!
    $staffEmail: String!
    $staffFirstName: String!
    $staffLastName: String!
    $staffPhoneNumber: String!
){
    createUser(input:{
      username: $staffUsername
      password: $staffPassword
      email: $staffEmail
      firstName: $staffFirstName
      lastName: $staffLastName
      phoneNumber: $staffPhoneNumber
     image:"https://res.cloudinary.com/dsw3onksq/image/upload/v1592728825/user_x89zcm.png"
    }){
      status
      user {
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
        agency{
          id
          name
          agencyEmail
        }

      }
    }
  }
`

const FETCH_USERS_QUERY = gql`
  query getUsers($search:String,$page:Int, $limit:Int) {
    users(isStaff:true, limit:$limit,page:$page, search:$search)
    {
      items{
        createdAt
        id
        deletedAt
        firstName
        phoneNumber
        lastName
        isActive
        email
      }
      page
      count
      pages
      hasNext
      hasPrev
    }
    }
`;

export default AdminDashBoard;
