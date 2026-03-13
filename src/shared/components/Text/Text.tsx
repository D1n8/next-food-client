'use client'
import * as React from 'react';
import styles from './Text.module.scss';
import classNames from 'classnames';

export type TextProps = {
    className?: string;
    view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span' | 'li';
    weight?: 'normal' | 'medium' | 'bold';
    children: React.ReactNode;
    color?: 'primary' | 'secondary' | 'accent';
    maxLines?: number;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

const Text: React.FC<TextProps> = (props) => {

    const Tag = props.tag ? props.tag : 'p'

    return (
        <Tag 
        {...props.onMouseEnter} 
        {...props.onMouseLeave} 
        onClick={() => props.onClick && props.onClick()} 
        className={classNames(
                styles.textContainer,
                props.className,
                props.view && styles[props.view],
                props.color && styles[props.color])}
            style={
                {
                    fontWeight: props.weight,
                    WebkitLineClamp: props.maxLines
                }}
            >{props.children}</Tag>
    )
}

export default Text;