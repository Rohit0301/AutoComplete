import Chip from "../Chip";
import DropDown from "../DropDown";
import React, { useState } from "react";
import { IDropDownItem } from "../../types";

import "./styles.css";

const AutoComplete: React.FC = () => {
	const [lastOption, setLastOption] = useState<IDropDownItem | null>();
	const [selectedOptions, setSelectedOptions] = useState<IDropDownItem[]>([]);

	const handleOnSelectChip = (item: IDropDownItem) => {
		setSelectedOptions((prev) => [...prev, item]);
	};

	const handleRemoveChip = (chipId: number) => {
		let updatedChips = selectedOptions.filter(
			(item: IDropDownItem) => item?.id !== chipId
		);
		setSelectedOptions(updatedChips);
		setLastOption(null)
	};

	return (
		<div className="autocomplete">
			<div className="autocomplete-chip-container">
				{selectedOptions.map(({ id, name, logo }) => (
					<Chip
						id={id}
						key={id}
						logo={logo}
						title={name}
						onClose={handleRemoveChip}
						isSelected={id === lastOption?.id}
					/>
				))}

				<DropDown
					lastOption={lastOption}
					onSelect={handleOnSelectChip}
					setLastOption={setLastOption}
					selectedOptions={selectedOptions}
					handleRemoveChip={handleRemoveChip}
				/>
			</div>
		</div>
	);
};

export default AutoComplete;
