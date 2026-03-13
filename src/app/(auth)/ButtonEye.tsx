'use client'

import HiddenEye from "@components/Icons/HiddenEye/HiddenEye";
import OpenedEye from "@components/Icons/OpenedEye/OpenedEye";

interface IButtonEye {
    show: boolean,
    setIsShow: (a: boolean) => void
}

function ButtonEye({show, setIsShow}: IButtonEye) {
    return (
        <button
            type="button"
            onClick={() => setIsShow(!show)}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--color-secondary)'
            }}
        >
            {show ?
                <HiddenEye />
                :
                <OpenedEye />
            }
        </button>
    );
}

export default ButtonEye;