
interface ReviewItemProps {
    label: string,
    score: string,
    icon: React.ReactNode,
}

const ReviewItem: React.FC<ReviewItemProps> = ({
    label,
    score,
    icon,
}) => {
    return (
        <div className="px-2 border-l-[1px]">
            <h1 className="flex">{label}</h1>
            <span className="flex mb-5">{score}</span>
            {icon}
        </div>
    );
}

export default ReviewItem;