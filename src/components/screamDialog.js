import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../util/MyButton';
import LikeButton from "./likeButton";
import Comments from "./comments";
import dayjs from "dayjs";
import { Link } from 'react-router-dom'
import CommentForm from "./commentForm";

//Mui stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//icon
import UnfoldMore from '@material-ui/icons/UnfoldMore'
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from "@material-ui/icons/Chat";

//redux stuff
import { connect } from 'react-redux'
import { getScream, clearErrors } from "../redux/actions/dataActions";

const styles= theme =>({
    ...theme.spreadIt,
    content:{
        marginTop:'5%'
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    commentSection:{
        marginLeft:'38%',
        marginBottom: '15px'
    },
    closeButton:{
        position: 'absolute',
        left: '90%'
    },
    expandButton:{
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv:{
        textAlign:'center',
        marginTop: 50,
        marginBottom:50
    }
});

class ScreamDialog extends Component{
    state={
        open: false,
        oldPath:'',
        newPath:''
    };

    componentDidMount() {
        if (this.props.openDialog){
            this.handleOpen()
        }
    }

    handleOpen=()=>{
        let oldPath = window.location.pathname;

        const { userHandle, screamId } = this.props;
        const newPath = `/users/${userHandle}/scream/${screamId}`;

        if(oldPath === newPath) oldPath=`/users/${userHandle}`;

        window.history.pushState(null, null, newPath);

        this.setState({open: true, oldPath, newPath});
        this.props.getScream(this.props.screamId)
    };

    handleClose=()=>{
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({open: false, errors:{}});
        this.props.clearErrors()
    };

    render() {
        const { classes,
            scream:{
            screamId,
            body,
            createdAt,
            likeCount,
            commentCount,
            userImage,
            userHandle,
            comments
            },
            ui:{ loading }} = this.props;

        let dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={100} thickness={2}/>
            </div>

        ):(
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7} className={classes.content}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/user/${userHandle}`}>
                                @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body1">
                        {body}
                    </Typography>

                    <LikeButton screamId={screamId}/>

                    <span>{likeCount > 1 ?
                        (<span>{likeCount} likes</span>) :
                        (<span>{likeCount} like</span>)}
                    </span>

                    <MyButton tip="comment">
                        <ChatIcon color="primary"/>
                    </MyButton>

                    <span>{commentCount > 1 ?
                        (<span>{commentCount} comments</span>) :
                        (<span>{commentCount} comment</span>)}
                    </span>
                </Grid>
                <hr className={classes.visibleSeparator}/>
                <CommentForm screamId={screamId}/>
                <span className={classes.commentSection}>Comment Section</span>
                <Comments comments={comments}/>
            </Grid>
        );
    return(
        <Fragment>
            <MyButton onClick={this.handleOpen} tip="Expand Scream" tipClassName={classes.expandButton}>
                <UnfoldMore color="primary"/>
            </MyButton>

            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth maxWidth="sm"
            >
                <MyButton onClick={this.handleClose} tip="Close" tipClassName={classes.closeButton}>
                    <CloseIcon/>
                </MyButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
        </Fragment>
    )

    }
}

ScreamDialog.propTypes={
    getScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
};

const mapStateToProps = (state) =>({
    scream: state.data.scream,
    ui: state.ui
});

const mapActionsToProps ={
    getScream,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps) (withStyles(styles)(ScreamDialog))
