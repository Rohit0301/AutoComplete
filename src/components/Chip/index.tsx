import { IDropDownItem } from "../../types";
import "./styles.css";

interface IChipProps {
	data: IDropDownItem;
	isSelected: boolean;
	onClose: (chipId: number) => void;
}

const Chip: React.FC<IChipProps> = ({ data, onClose, isSelected }) => {
	const { id, logo, name } = data;
	return (
		<div className={`chip ${isSelected && "selected-chip"}`}>
			<img src={logo} alt="logo" className="chip-logo" />
			<div className="chip-title">{name}</div>

			<div className="chip-close-btn">
				<i
					className="fa-sharp fa-solid fa-xmark"
					onClick={() => onClose(id)}
				></i>
			</div>
		</div>
	);
};

export default Chip;
