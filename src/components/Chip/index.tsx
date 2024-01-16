import "./styles.css";

interface IChipProps {
	id: number;
	title: string;
	logo: string;
	isSelected: boolean;
	onClose: (chipId: number) => void;
}

export default function Chip({
	id,
	logo,
	title,
	onClose,
	isSelected,
}: IChipProps) {
	return (
		<div className={`chip ${isSelected && "selected-chip"}`}>
			<img src={logo} alt="logo" className="chip-logo" />
			<div className="chip-title">{title}</div>

			<div className="chip-close-btn">
				<i
					className="fa-sharp fa-solid fa-xmark"
					onClick={() => onClose(id)}
				></i>
			</div>
		</div>
	);
}
