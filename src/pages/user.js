import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/scream'
import Grid from "@material-ui/core/Grid";
import StaticProfile from '../components/staticProfile';
import ScreamSkeleton from '../util/screamSkeleton'
import ProfileSkeleton from "../util/profileSkeleton";

//redux
import { connect } from "react-redux";
import { singleUserData } from "../redux/actions/dataActions";




class User extends Component {
    state={
        profile: null,
        screamIdParam: null
    };
    componentDidMount() {
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;

        if(screamId) this.setState({screamIdParam: screamId});
        console.log('handle is:', handle);
        this.props.singleUserData(handle);
        axios.get(`/user/${handle}`)
            .then((res)=>{
                this.setState({profile: res.data.user})
            })
            .catch((err)=>console.log(err))
    }

    render() {
        const { screams, loading } = this.props.data;
        const { screamIdParam } = this.state;

        const screamsMarkup = loading?(
            <ScreamSkeleton/>
        ) : screams === null ? (
            <p>No scream created by the user</p>
        ) : !screamIdParam? (
            screams.map((scream)=>
                <Scream key={scream.screamId} scream={scream}/>)
        ) : (
            screams.map((scream) => {
                if(scream.screamId !== screamIdParam)
                    return <Scream key={scream.screamId} scream={scream}/>;
                else return <Scream key={scream.screamId} scream={scream} openDialog/>
                })
        );
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ?(
                        <ProfileSkeleton/>
                    ):(
                        <StaticProfile profile={this.state.profile}/>
                    )}
                </Grid>
            </Grid>
        );
    }
}

User.propTypes ={
    data: PropTypes.object.isRequired,
    singleUserData: PropTypes.func.isRequired
};

const mapStateToProps = (state) =>({
    data: state.data
});


export default connect(mapStateToProps, {singleUserData}) (User);
