import React, {Component} from 'react';
import axios from 'axios';

import View from './View';
import Project from './Project';
import AddProjectForm from './AddProjectForm';
import EditProjectForm from './EditProjectForm';

import './App.css';

var urlPrefix = 'http://10.2.24.38:4000/api'

class  App extends Component {

  constructor(props){
    super(props)

    this.state = {
      activeView:'projects',
      projects:[
        {
          id:1,
          name:'Build a hut',
          description: 'Nice project'
        },{
          id:2,
          name:'Make a basket',
          description: 'Pretty project'
        }
      ],
      types:[],
      currentType:null,
      projectToUpdate:null
    };

  }
  setActiveView = (view) => {
    this.setState({activeView:view});
  }

  setProjectToUpdate = (id) => {

    var foundProject = this.state.projects.find((project) => {
      return project.id === id;
    })
    this.setState({projectToUpdate:foundProject})
  }

  setCurrentType = (id) => {

    var foundType = this.state.types.find((type) => {
      return type.id == id;
    })

    foundType ? this.setState({currentType:foundType}) : this.setState({currentType:null})

    
  }


  getProjects = () => {
    axios.get(urlPrefix+'/projects')
    .then(res => {
      this.setState({projects:res.data});
    })
  }

  getTypes = () => {
    axios.get(urlPrefix+'/types')
    .then(res => {
      this.setState({types:res.data});
    })
  }

  addProjects = (data) => {
    axios.post(urlPrefix+'/projects',data)
    .then(res => {
      this.getProjects()
    })
  }

  deleteProjects = (id) => {
    axios.delete(urlPrefix+'/projects/'+id)
    .then(res => {

      this.getProjects();
    })
  }

  updateProjects = (id,data) => {
    axios.put(urlPrefix+'/projects/'+id,data)
    .then(res => {
      this.getProjects();
    })
  }

  componentDidMount(){
    this.getProjects();
    this.getTypes();
  }

  handleProjectTypeClick = (e) => {

    var link = e.target;

    this.setCurrentType(link.dataset.type);
    this.setActiveView('projects');
  }

  render(){
    var {currentType, projects} = this.state;

    if(currentType){

      projects = projects.filter(project => {
        return project.type_id == currentType.id
      })

    }
    return (
        <div className="app">
      
          <View viewName="projects" activeView={this.state.activeView} className="color1" >

            <div className="header">
              <i onClick={() => this.setActiveView('add-project')} className="fas fa-plus"></i>
              <i onClick={() => this.setActiveView('nav')} className="fas fa-bars"></i>
            </div>
            <div className="main">
              <h3>{ currentType ? currentType.name : 'All Projects'}</h3>

              {
                projects.map((project) => {

                  var projectProps = {
                    ...project,
                    key: project.id,
                    deleteProjects: this.deleteProjects,
                    setActiveView: this.setActiveView,
                    setProjectToUpdate: this.setProjectToUpdate
                  };
                  return (<Project {...projectProps} />)
                })
              }
              

            
            </div>

          </View>

          <View viewName="add-project" activeView={this.state.activeView} className="color2" >

            <div className="header">
              <i onClick={() => this.setActiveView('projects')} className="fas fa-times"></i>
            </div>
            <div className="main">
              <h3>Add a project</h3>
              <AddProjectForm addProjects={this.addProjects} setActiveView={this.setActiveView}/>
            </div>

          </View>

          <View viewName="edit-project" activeView={this.state.activeView} className="color3" >

            <div className="header">
              <i onClick={() => this.setActiveView('projects')} className="fas fa-times"></i>
            </div>
            <div className="main">
              <h3>Edit a project</h3>
              <EditProjectForm {...this.state.projectToUpdate} updateProjects={this.updateProjects} setActiveView={this.setActiveView} />
            </div>

          </View>

        
          <View viewName="nav" activeView={this.state.activeView} className="color5" Name>

            <div className="header"><i className="fas fa-times"></i></div>
            <div className="main">

              <ul className="menu">

                <li><a data-type="null" onClick={this.handleProjectTypeClick} className="color1" href="#">All projects</a></li>
                {
                  this.state.types.map(type => {
                    return (
                      <li>
                        <a data-type={type.id} onClick={this.handleProjectTypeClick} className="color1" href="#">{type.name}</a>
                      </li>
                      )
                  })
                }

                <li><a onClick={() => this.setActiveView('add-project')} className="color2" href="#">Add a project</a></li>
         
              </ul>

            </div>

          </View>

        </div>
    );
  }



}

export default App;
