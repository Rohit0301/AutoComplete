import Chip from "../Chip";
import DropDown from "../DropDown";
import React, {
	ChangeEvent,
	KeyboardEvent,
	useMemo,
	useRef,
	useState,
} from "react";
import { IDropDownItem } from "../../types";

import "./styles.css";

interface IAutoCompleteProps {
	id: string;
	options: IDropDownItem[];
	inputValue: string | undefined;
	selectedOptions: IDropDownItem[];
	onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSelect: (selectedOptions: IDropDownItem[]) => void;
}

const AutoComplete: React.FC<IAutoCompleteProps> = ({
	id,
	options,
	onSelect,
	inputValue,
	onInputChange,
	selectedOptions,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	const [lastOption, setLastOption] = useState<IDropDownItem | null>(null);

	// returning all values which are not selected and have inputValue in the name
	const filteredDropDownItems: IDropDownItem[] = useMemo(
		() =>
			options.filter(
				({ id, name }) =>
					selectedOptions.findIndex(
						(chip: IDropDownItem) => chip?.id === id
					) === -1 &&
					name.toLowerCase().includes((inputValue || "").toLowerCase())
			),
		[selectedOptions, inputValue]
	);

	const handleOnSelectOption = (item: IDropDownItem) => {
		onSelect([...selectedOptions, item]);
		inputRef?.current ? (inputRef.current.value = "") : null;
	};

	const handleOnRemoveOption = (chipId: number) => {
		let updatedChips = selectedOptions.filter(
			(item: IDropDownItem) => item?.id !== chipId
		);
		onSelect(updatedChips);
		setLastOption(null);
	};

	// handing multiple keyboard click events
	const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Backspace" &&
			!inputValue?.trim() &&
			selectedOptions.length > 0
		) {
			if (lastOption) {
				handleOnRemoveOption(lastOption?.id);
				setLastOption(null);
			} else {
				setLastOption(selectedOptions[selectedOptions.length - 1]);
			}
		} else if (
			e.key === "ArrowDown" &&
			focusedIndex < filteredDropDownItems.length - 1
		) {
			setFocusedIndex((prevIndex) => prevIndex + 1);
			scrollDropDownItemIntoView();
		} else if (e.key === "ArrowUp" && focusedIndex > 0) {
			setFocusedIndex((prevIndex) => prevIndex - 1);
			scrollDropDownItemIntoView();
		} else if (e.key === "Enter" && focusedIndex !== -1) {
			handleOnSelectOption(filteredDropDownItems[focusedIndex]);
			setFocusedIndex(-1);
			inputRef?.current ? (inputRef.current.value = "") : null;
		}
	};

	// scroll the dropdown when up and down key in clicked
	const scrollDropDownItemIntoView = () => {
		if (dropdownRef.current && focusedIndex !== -1) {
			const FIXED_SCROLL = 60;
			const focusedItem = dropdownRef.current.children[
				focusedIndex
			] as HTMLElement;
			const containerHeight = dropdownRef.current.clientHeight;

			// Check if the focused item is below or above the visible area
			const isBelowVisibleArea =
				focusedItem.offsetTop + focusedItem.clientHeight >
				dropdownRef.current.scrollTop + containerHeight;
			const isAboveVisibleArea =
				focusedItem.offsetTop < dropdownRef.current.scrollTop;

			if (isBelowVisibleArea) {
				const newScrollTop =
					focusedItem.offsetTop + focusedItem.clientHeight - containerHeight;
				dropdownRef.current.scrollTop = newScrollTop + FIXED_SCROLL;
			} else if (isAboveVisibleArea) {
				const newScrollTop = focusedItem.offsetTop - FIXED_SCROLL;
				dropdownRef.current.scrollTop = newScrollTop;
			}
		}
	};

	return (
		<div className="autocomplete" id={id}>
			<div className="autocomplete-chip-container">
				{selectedOptions.map((item) => (
					<Chip
						data={item}
						key={item.id}
						onClose={handleOnRemoveOption}
						isSelected={item?.id === lastOption?.id}
					/>
				))}

				<DropDown
					inputRef={inputRef}
					inputValue={inputValue}
					dropdownRef={dropdownRef}
					focusedIndex={focusedIndex}
					options={filteredDropDownItems}
					onSelect={handleOnSelectOption}
				>
					<input
						type="text"
						ref={inputRef}
						value={inputValue}
						onChange={onInputChange}
						onKeyDown={handleInputKeyDown}
						placeholder="Add new user..."
					/>
				</DropDown>
			</div>
		</div>
	);
};

export default AutoComplete;
