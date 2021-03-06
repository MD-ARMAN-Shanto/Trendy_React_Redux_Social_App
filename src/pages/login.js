import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/appIcon.jpg'
//MUI Stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from "react-router-dom";

//Redux stuff
import { connect } from 'react-redux';
import { loginUser } from "../redux/actions/userActions";

const styles=(theme)=>({
    ...theme.spreadIt
});

class Login extends PureComponent {
    constructor(){
        super();
        this.state={
            email: '',
            password: '',
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.ui.errors){
            this.setState({errors: nextProps.ui.errors})
        }
    }

    handleSubmit=(event) =>{
        event.preventDefault();
        this.setState({
            loading: true
        });
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history)
    };

    handleChange=(event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        const { classes, ui: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm className={classes.title}>
                    <img src={AppIcon} alt="App Icon" className={classes.image}/>
                    <Typography
                        variant="h5"
                        color="textPrimary">
                        Login
                    </Typography>

                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            className={classes.textField}
                            id="email" name="email" type="email"
                            helperText={errors.email}
                            error={!!errors.email}
                            label="Email"
                            value={this.state.email}
                            placeholder="Enter your email"
                            onChange={this.handleChange}
                            fullWidth
                        />

                        <TextField
                            className={classes.textField}
                            id="password" name="password"
                            label="Password" type="password"
                            helperText={errors.password}
                            error={!!errors.password}
                            value={this.state.password}
                            placeholder="Enter your password"
                            onChange={this.handleChange}
                            fullWidth
                        />
                        {errors.general && (
                            <Typography
                                variant="body1"
                                className={classes.customError}
                            >
                                {errors.general}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={loading}
                        >Login
                            {loading &&(
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>
                        <small>
                            Don't have an account? Sign up <Link to="/signup" className={classes.link}>here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    email: PropTypes.string,
    password: PropTypes.string,
    errors: PropTypes.object,
    loading: PropTypes.bool
};

const mapStateToProps = (state) =>({
    user: state.user,
    ui: state.ui
});

const mapActionsToProps = {
    loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));
