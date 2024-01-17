import {
	useState,
	useEffect,
	ReactNode,
	RefObject,
} from "react";
import { IDropDownItem } from "../../types";
import "./styles.css";

export interface IDropDownItemProps {
	isFocused: boolean;
	data: IDropDownItem;
}

export interface IDropDownProps {
	children: ReactNode;
	focusedIndex: number;
	options: IDropDownItem[];
	inputValue: string | undefined;
	inputRef: RefObject<HTMLDivElement>;
	dropdownRef: RefObject<HTMLDivElement>;
	onSelect: (item: IDropDownItem) => void;
}

const DropDown: React.FC<IDropDownProps> = ({
	options,
	inputRef,
	children,
	onSelect,
	inputValue,
	dropdownRef,
	focusedIndex,
}) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

	useEffect(() => {
		// closing the dropdown if user selected anywhere outside the dropdown
		const handleDocumentClick = (e: MouseEvent) => {
			const currentNode = e.target as HTMLElement
			if (
				!inputRef?.current?.contains(currentNode) &&
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


	function DropDownItem({ data, isFocused }: IDropDownItemProps) {
		const { logo, name, email_id } = data;

		const handleItemClick = () => {
			onSelect(data);
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
			{children}
			{isDropdownVisible && (
				<div className="dropdown" ref={dropdownRef}>
					{options.length > 0 ? (
						options.map((item, index) => (
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
const highlightText = (item: string, inputValue: string | undefined): React.ReactNode => {
	if (!inputValue?.trim()) return item;
	const regex = new RegExp(`(${inputValue?.trim()})`, "gi");
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


export default DropDown
