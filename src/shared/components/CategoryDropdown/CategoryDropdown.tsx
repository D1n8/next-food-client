'use client'
import MultiDropdown from "@components/Dropdowns/MultiDropdown";
import { observer } from "mobx-react-lite";
import { useCategoryDropdown } from "@shared/hooks/useCategoryDropdown";

const CategoryDropdown = observer(() => {
    const { 
        options, 
        value, 
        onChange, 
        onApply, 
        getTitle,
        clear
    } = useCategoryDropdown();

    return (
        <MultiDropdown
            options={options}
            value={value}
            onChange={onChange}
            getTitle={getTitle}
            action={onApply}
            clear={clear}
            placeholder="Categories" 
        />
    );
});

export default CategoryDropdown;