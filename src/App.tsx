import "./App.css";
import { useState } from "react";
import { dropdownItems } from "./constants";
import AutoComplete from "./components/AutoComplete";

function App() {
	const [inputValue, setInputValue] = useState<string>();
	const [selectedValues, setSelectedValue] = useState<Array<any>>([]);

	const handleSelectionChange = (selectedValues: Array<any>) => {
		setSelectedValue(selectedValues)
		setInputValue("")
	}
	return (
		<div className="main-container">
			<h1>Pick User</h1>
			<AutoComplete
				id="dropdown"
				options={dropdownItems}
				inputValue={inputValue}
				selectedOptions={selectedValues}
				onSelect={handleSelectionChange}
				onInputChange={(e) => setInputValue(e.target.value)}
			/>
		</div>
	);
}

export default App;
