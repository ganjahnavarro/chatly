import React, { Component } from 'react';
import uploadcare from 'uploadcare-widget';

class UploadCare extends Component {

    static defaultProps = {
        onLoading: () => {},
        label: "Upload Attachment",
        crop: "240x240",
        tabs: ["file", "camera"],
        instruction: null,
        className: "btn btn-info btn-block"
    }

    state = {
        isUploading: false,
        progress: 0,
        showInstruction: false
    }

    handleUpload = (e) => {
        e.preventDefault();
        if(this.state.isUploading) {
            return;
        }
        
        this.setState({ showInstruction: false });

        uploadcare
            .openDialog(null, {
                publicKey: '7f29586cbc16db1c11ad',
                tabs: this.props.tabs,
                crop: this.props.crop,
                imageOnly: true
            })
            .done((file) => {
                this.props.onLoading(true)
                file
                    .progress(this.handleProgress)
                    .done(this.handleDone)
            })
    }

    handleDone = ({ cdnUrl }) => {
        this.props.onUploaded(cdnUrl);
    }

    handleProgress = ({ state, progress }) => {

        if(state === "uploading") {
            this.setState({
                isUploading: true,
                progress: Math.ceil(progress * 100) 
            })
        }

        if(state === "uploaded") {
            this.setState({
                isUploading: true,
                progress: 100
            })
        }

        if(state === "ready") {
            this.props.onLoading(false)
            this.setState({
                isUploading: false,
                progress: 0
            })
        }
    }

    handleShowInstruction = (showInstruction) => (e) => {
        e.preventDefault();
        this.setState({ showInstruction })
    }

    render() {
        const Progress = () => {
            if(this.state.isUploading) {
                return (
                    <div>
                        <span>Uploading ({ this.state.progress }%)...</span>
                    </div>
                )
            }
            return <span></span>;
        }

        const Instruction = () => {
            return (
                <div style={{ position: 'absolute'}}>
                    <div className="modal fade show" style={{display: 'block', zIndex: 1051, pointerEvents: "none"}}>
                        <div className="modal-dialog modal-lg" style={{pointerEvents:"initial"}}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Upload Instructions</h4>
                                </div>
                                <div className="modal-body">
                                    { this.props.instruction }
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={ this.handleUpload }>Proceed</button>
                                    { ' ' }
                                    <button 
                                        className="btn btn-default"
                                        onClick={ this.handleShowInstruction(false) }>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" style={{zIndex: 1050, pointerEvents: "initial"}}/>
                </div>
            )
        }

        return (
            [
                <button 
                    key="upload-button"
                    onClick={ this.props.instruction ? this.handleShowInstruction(true) : this.handleUpload } 
                    className={ this.props.className }>
                    {
                        this.state.isUploading
                            ? <Progress/>
                            : <div>
                                { this.props.btnCaption || this.props.label }
                            </div>
                    }
                </button>,
                this.state.showInstruction ? <Instruction key="upload-instruction"/> : null
            ]
        );
    }
}

export default UploadCare
