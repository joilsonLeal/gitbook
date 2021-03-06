import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';

import { Form, SubmitButton, List } from './styles';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    load: false,
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if(repositories)
      this.setState({ repositories: JSON.parse(repositories) });
  }

  componentDidUpdate(prevProps, prevStates) {
    const { repositories } = this.state;

    if(prevStates.repositories !== repositories)
      localStorage.setItem(
        'repositories',
        JSON.stringify(repositories)
      );
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ load: true });

    const { newRepo, repositories } = this.state;
    try {
      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        load: false,
      });

    } catch (error) {
      this.setState({load: false});
    }
  }

  render () {
    const { newRepo, repositories, load } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt/>
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton load={load}>
            { load ? (
              <FaSpinner color="#FFF" size={14}/>
            ) : (
              <FaPlus color="#FFF" size={14}/>
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
