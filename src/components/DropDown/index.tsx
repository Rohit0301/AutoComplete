import {
	useRef,
	useMemo,
	useState,
	useEffect,
	ChangeEvent,
	KeyboardEvent,
} from "react";
import { IDropDownItem } from "../../types";
import "./styles.css";
import { dropdownItems } from "../../constants";

export interface IDropDownItemProps {
	isFocused: boolean;
	data: IDropDownItem;
}

export interface IDropDownProps {
	selectedOptions: IDropDownItem[];
	handleRemoveChip: (val: number) => void;
	onSelect: (item: IDropDownItem) => void;
	lastOption: IDropDownItem | null | undefined;
	setLastOption: (val: IDropDownItem | null) => void;
}

export default function DropDown({
	onSelect,
	lastOption,
	setLastOption,
	selectedOptions,
	handleRemoveChip,
}: IDropDownProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [inputValue, setInputValue] = useState<string>("");
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

	// returning all values which are not selected and have inputValue in the name
	const filteredDropDownItems: IDropDownItem[] = useMemo(
		() =>
			dropdownItems.filter(
				({ id, name }) =>
					selectedOptions.findIndex(
						(chip: IDropDownItem) => chip?.id === id
					) === -1 && name.toLowerCase().includes(inputValue.toLowerCase())
			),
		[selectedOptions, inputValue]
	);

	useEffect(() => {
		// closing the dropdown if user selected anywhere outside the dropdown
		const handleDocumentClick = (e: MouseEvent) => {
			const currentNode = e.target as HTMLElement
			if (
				!inputRef.current?.contains(currentNode) &&
				!currentNode?.classList[0]?.includes('dropdown')
			) {
				setIsDropdownVisible(false);
			}
		};
		document.addEventListener("click", handleDocumentClick);
		return () => {
			document.removeEventListener("click", handleDocumentClick);
		};
	}, []);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
	};

	// handing multiple keyboard click events
	const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Backspace" &&
			inputValue === "" &&
			selectedOptions.length > 0
		) {
			const lastChip = selectedOptions[selectedOptions.length - 1];
			if (lastOption) {
				handleRemoveChip(lastChip?.id);
				setLastOption(null);
			} else {
				setLastOption(lastChip);
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
			onSelect(filteredDropDownItems[focusedIndex]);
			setFocusedIndex(-1);
			setInputValue("");
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

	function DropDownItem({ data, isFocused }: IDropDownItemProps) {
		const { logo, name, email_id } = data;

		const handleItemClick = () => {
			onSelect(data);
			setInputValue("");
		};

		return (
			<div
				className={`dropdown-item ${isFocused && "dropdown-item-focused"}`}
				onClick={handleItemClick}
			>
				<img src={logo} alt="logo" className="dropdown-item-image" />
				<div className="dropdown-item-text">
					<div className="dropdown-item-name">
						{highlightText(name, inputValue)}
					</div>
					<div className="dropdown-item-email">{email_id}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="input-container" onClick={() => setIsDropdownVisible(true)}>
			<input
				type="text"
				ref={inputRef}
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleInputKeyDown}
				placeholder="Add new user..."
			/>
			{isDropdownVisible && (
				<div className="dropdown" ref={dropdownRef}>
					{filteredDropDownItems.length > 0 ? (
						filteredDropDownItems.map((item, index) => (
							<DropDownItem
								data={item}
								key={item?.id}
								isFocused={index === focusedIndex}
							></DropDownItem>
						))
					) : (
						<div className="empty-items">No Options found !</div>
					)}
				</div>
			)}
		</div>
	);
}

// This function highlight the input value in all the names of the list
const highlightText = (item: string, inputValue: string): React.ReactNode => {
	if (!inputValue.trim()) return item;
	const regex = new RegExp(`(${inputValue.trim()})`, "gi");
	const parts = item.split(regex);
	return parts.map((part, index) =>
		regex.test(part) ? (
			<span key={index} className="highlight">
				{part}
			</span>
		) : (
			part
		)
	);
};
