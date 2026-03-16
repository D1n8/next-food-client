import Button from "@/shared/components/Button";
import { ButtonProps } from "@/shared/components/Button/Button";

const PlayButton: React.FC<ButtonProps> = ({
    className,
    ...props
}) => {
    return (
        <Button {...props} className={className}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33331 2L12.6666 8L3.33331 14V2Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </Button>
    );
}

export default PlayButton;