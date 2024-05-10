interface ReviewCardProps {
    name: string,
    location: string,
    description: string,

}
const ReviewCard: React.FC<ReviewCardProps> = ({
    name,
    location,
    description,
}) => {
    return (
        <div className=" bg-transparent flex items-center">
            <div className="px-5 py-4  rounded-lg">
                <div className="flex mb-4">
                    <img className="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                    <div className="ml-2 mt-0.5">
                        <span className="block font-medium text-base leading-snug text-black dark:text-gray-100">
                            {name}
                        </span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
                            {location}
                        </span>
                    </div>
                </div>
                <p className="h-[72px] text-gray-800 dark:text-gray-100 leading-snug md:leading-normal text-ellipsis overflow-hidden break-all ">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default ReviewCard;