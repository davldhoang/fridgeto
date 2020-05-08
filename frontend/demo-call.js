import React, {Component} from 'react';
import './App.css';

class Apps extends Component {
   constructor(){
       super();
       this.state ={users: []};
   }
   componentDidMount() {
          fetch('/profiles')
            .then(res => {
                console.log(res);
                return res.json()
             })
            .then(users => { 
                console.log(users); 
                this.setState({ users })
             });
         }
   render() {
        return (
            <div className="App">
                <h1>Profile</h1>
                {
                    this.state.users.map(profile =>
                        <div key={profile.userName}>user: {profile.fullName} Password: {profile.userPassword}</div>
                    )
                }
            </div>
        );
    }
}

export default App;
