import React, { Component } from 'react'
import './App.css'
import web3 from './web3'
import lottery from './lottery'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
    }

    this.onEnterSubmit = this.onEnterSubmit.bind(this)
  }

  async componentDidMount () {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({
      manager,
      players,
      balance
    })
  }

  async onEnterSubmit (event) {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    this.setState({ message: 'Waiting on transaction success...' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({ message: 'Entry successful!' })
  }

  render () {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        <hr />
        <form onSubmit={this.onEnterSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label htmlFor=''>Amount of ether to enter</label>
            <input type='text' value={this.state.value} onChange={event => this.setState({value: event.target.value})} />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    )
  }
}

export default App
