import type { SortKey } from "@components/SortDropdown/const";

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

export type DropdownProps = {
  /**Передаем выбранное значение*/
  getTitle: (key: any) => string;
  options: Option[],
  /**Ключ выбранного значения*/
  selectedKey: string,
  onSelect: (value: SortKey) => void,
  isActive: boolean
}

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
  placeholder: string;
  action: () => void;
  clear: () => void;
};