import Button from "@/shared/components/Button";
import { ButtonProps } from "@/shared/components/Button/Button";

const PauseButton: React.FC<ButtonProps> = ({
    className,
    ...props
}) => {
    return (
        <Button {...props} className={className}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66667 2.66667H4V13.3333H6.66667V2.66667Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2.66667H9.33333V13.3333H12V2.66667Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </Button>
    );
}

export default PauseButton;