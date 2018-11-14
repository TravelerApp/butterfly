import React, {Component} from 'react';

export default class NotFound extends Component {
    render(){
        return(
            <div>
                <h3>Error 404 - Page was not found :(</h3>
                <h3><a href = "/">Take me to Homepage</a></h3>
            </div>
        )
    }
}