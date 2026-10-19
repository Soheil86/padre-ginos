const Pizza = (props) => {
	return React.createElement('div', {}, [
		React.createElement('h1', {}, props.name),
		React.createElement('p', {}, props.description),
	])
}

const App = () => {
	return React.createElement(
		'div',
		{},
		React.createElement('h1', {}, "Padre Gino's"),
		React.createElement(Pizza, {
			name: 'The Pepperoni Pizza',
			description: 'Some dope pizza yo',
		}),
	)
}

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)
root.render(React.createElement(App))
