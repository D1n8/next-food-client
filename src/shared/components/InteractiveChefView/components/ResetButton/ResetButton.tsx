import Button from "@/shared/components/Button";
import { ButtonProps } from "@/shared/components/Button/Button";

const resetButton: React.FC<ButtonProps> = ({
    className,
    ...props
}) => {
    return (
        <Button {...props} className={className}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_5565_401)">
                    <path d="M0.666687 2.66668V6.66668M0.666687 6.66668H4.66669M0.666687 6.66668L3.76002 3.76001C4.47652 3.04315 5.36294 2.51948 6.33656 2.23786C7.31018 1.95624 8.33928 1.92584 9.32783 2.14952C10.3164 2.37319 11.2322 2.84363 11.9897 3.51696C12.7473 4.19028 13.3219 5.04453 13.66 6.00001M15.3334 13.3333V9.33334M15.3334 9.33334H11.3334M15.3334 9.33334L12.24 12.24C11.5235 12.9569 10.6371 13.4805 9.66348 13.7622C8.68986 14.0438 7.66076 14.0742 6.67221 13.8505C5.68366 13.6268 4.76789 13.1564 4.01033 12.4831C3.25278 11.8097 2.67813 10.9555 2.34002 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_5565_401">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </Button>
    );
}

export default resetButton;