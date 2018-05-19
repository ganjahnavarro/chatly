import _ from 'lodash'
import classNames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'

import Provider from '../core/Provider'
import Formatter from '../core/Formatter'
import Utils from '../core/Utils'

import Input from './Input'
import Button from './Button'
import Dropdown from './Dropdown'


class Datatable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            invalidRowIndexes: [],
            newRowAdded: false
        };

        this.editableColumnIndexes = [];
    }

    componentWillReceiveProps(nextProps) {
        this.handleColumnsChange(nextProps);
        this.handleRowsChange(nextProps);
    }

    handleColumnsChange(nextProps) {
        if (nextProps.columns) {
            nextProps.columns.forEach((col, index) => {
                if (col.editable) {
                    this.editableColumnIndexes.push(index);
                }
            });
        }
    }

    handleRowsChange(nextProps) {
        if (nextProps.rows) {
            let nextState = this.state;
            nextState.rows = nextProps.rows;

            let lastRow = nextProps.rows[nextProps.rows.length - 1];
            let isLastRowEmpty = Utils.isEmpty(lastRow);
            nextState.newRowAdded = isLastRowEmpty;

            this.setState(nextState);
        }
    }

    getRows() {
        let { rows } = this.state;
        return rows.filter((row) => row.stock !== null);
    }

    componentDidMount() {
        // TODO
        // $(document).keydown((event) => {
        //     let navigateX = [37, 39].includes(event.keyCode);
        //     let navigateY = [38, 40].includes(event.keyCode) && !this.isSelecting();
        //
        //     if (navigateX || navigateY) {
        //         this.onCellFocus = true;
        //         if (event.keyCode === 37) this.onArrowLeft();
        //         if (event.keyCode === 38) this.onArrowUp();
        //         if (event.keyCode === 39) this.onArrowRight();
        //         if (event.keyCode === 40) this.onArrowDown();
        //         return false;
        //     }
        // });
        this.componentWillReceiveProps(this.props);
    }

    isSelecting() {
        let element = ReactDOM.findDOMNode(this.selectedDropdown);

        if (element) {
            let select = element.getElementsByClassName("Select");
            let hasClass = (element, className) => {
                return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
            }
            return hasClass(select[0], "is-open") && hasClass(select[0], "is-focused");
        }
    }

    onArrowDown() {
        let { selectedRowIndex } = this.state;
        let previousSelectedRowIndex = selectedRowIndex;

        let rows = this.state.rows || [];
        selectedRowIndex = Math.min(rows.length, selectedRowIndex + 1);
        this.setState({
            invalidRowIndexes: this.getInvalidRowIndexes(previousSelectedRowIndex),
            selectedRowIndex
        });
    }

    onArrowUp() {
        let { selectedRowIndex } = this.state;
        let previousSelectedRowIndex = selectedRowIndex;

        selectedRowIndex = Math.max(0, selectedRowIndex - 1);
        this.setState({
            invalidRowIndexes: this.getInvalidRowIndexes(previousSelectedRowIndex),
            selectedRowIndex
        });
    }

    onArrowLeft() {
        let continueSearch = true;
        let { selectedColumnIndex, selectedRowIndex, invalidRowIndexes } = this.state;
        let previousSelectedRowIndex = selectedRowIndex;

        do {
            if (this.isFirstColumn(selectedColumnIndex)) {
                if (this.isFirstRow(selectedRowIndex)) {
                    continueSearch = false;
                    selectedColumnIndex = null;
                    selectedRowIndex = null;
                    this.onCellFocus = false;
                    this.props.getLastInput().focus();
                } else {
                    selectedRowIndex--;
                    selectedColumnIndex = this.props.columns.length;
                }
            } else {
                selectedColumnIndex--;
            }

            if (this.isColumnEditable(selectedColumnIndex)) {
                invalidRowIndexes = this.getInvalidRowIndexes(previousSelectedRowIndex);
                continueSearch = false;
            }
        }
        while (continueSearch);

        this.setState({selectedColumnIndex, selectedRowIndex, invalidRowIndexes});
    }

    onArrowRight() {
        let continueSearch = true;
        let { selectedColumnIndex, selectedRowIndex, newRowAdded, invalidRowIndexes } = this.state;
        let previousSelectedRowIndex = selectedRowIndex;

        do {
            if (this.isLastColumn(selectedColumnIndex)) {
                if (this.isLastRow(selectedRowIndex)) {
                    if (newRowAdded) {
                        continueSearch = false;
                        selectedColumnIndex = null;
                        selectedRowIndex = null;
                        this.onCellFocus = false;
                        this.props.getFirstInput().focus();
                    } else {
                        this.addRow();
                        selectedRowIndex++;
                        selectedColumnIndex = 0;
                    }
                } else {
                    selectedRowIndex++;
                    selectedColumnIndex = 0;
                }
            } else {
                selectedColumnIndex++;
            }

            if (this.isColumnEditable(selectedColumnIndex)) {
                invalidRowIndexes = this.getInvalidRowIndexes(previousSelectedRowIndex);
                continueSearch = false;
            }
        }
        while (continueSearch);

        this.setState({selectedColumnIndex, selectedRowIndex, invalidRowIndexes});
    }

    selectFirstCell() {
        this.onCellFocus = true;
        this.setState({
            selectedRowIndex: 0,
            selectedColumnIndex: -1
        }, () => this.onArrowRight());
    }

    onKeyDown(event) {
        if (event.keyCode === 9) {
            event.preventDefault();
            this.onCellFocus = true;
            event.shiftKey ? this.onArrowLeft() : this.onArrowRight();
        }
    }

    isFirstColumn(columnIndex) {
        return columnIndex === 0;
    }

    isLastColumn(columnIndex) {
        return this.props.columns.length === columnIndex + 1;
    }

    isFirstRow(rowIndex) {
        return rowIndex === 0;
    }

    isLastRow(rowIndex) {
        let { rows } = this.state;
        return rows.length === rowIndex + 1;
    }

    isColumnEditable(columnIndex) {
        return this.editableColumnIndexes.includes(columnIndex);
    }

    addRow() {
        if (!this.state.newRowAdded) {
            let rows = this.state.rows;
            rows.push({});
            this.setState({rows, newRowAdded: true});
        }
    }

    componentDidUpdate() {
        if (this.selectedInput && this.onCellFocus) {
            this.selectedInput.focus();
            this.selectedInput.highlight();
            this.onCellFocus = false;
        }
    }

    getHeaders() {
        this.tabIndex = 1;

        let columns = this.props.columns.map((column) => <th key={column.key}>{column.name}</th>);
        return <thead>
            <tr>
                {columns}
                {this.props.allowedDelete && !this.props.disabled ? <th width={40}></th> : null}
            </tr>
        </thead>;
    }

    getBody() {
        let rows = this.state.rows;
        let rowComponents = [];

        if (rows) {
            rowComponents = rows.map((row, rowIndex) => this.getRow(row, rowIndex));
        }
        return <tbody>{rowComponents}</tbody>;
    }

    getRow(row, rowIndex) {
        let { selectedRowIndex, invalidRowIndexes } = this.state;
        let cells = this.props.columns.map((column, columnIndex) => {
            return this.renderCell(column, columnIndex, row, rowIndex);
        });

        let rowClassName = classNames({
            selected: rowIndex === selectedRowIndex,
            invalid: invalidRowIndexes.includes(rowIndex)
        });

        return <tr key={rowIndex} className={rowClassName}>
            {cells}
            {this.getDeleteCell(rowIndex)}
        </tr>;
    }

    getDeleteCell(rowIndex) {
        if (this.props.allowedDelete && !this.props.disabled) {
            let deleteClick = () => {
                this.state.rows.splice(rowIndex, 1);
                this.forceUpdate();
            };

            return <td>
                <Button icon="trash" className="ui icon button mini" data-tooltip="Remove Item" onClick={deleteClick}></Button>
            </td>;
        }
        return null;
    }

    onCellEdit(columnKey, rowIndex, event) {
        let rows = this.state.rows;
        _.set(rows[rowIndex], columnKey, event.target.value);
        this.setState({rows});

        this.onCellFocus = false;
        this.onRowsChange(rows);
    }

    onStockSelect(columnIndex, columnKey, rowIndex, selected) {
        let stocks = Provider.filteredItems[columnKey];
        let stock = stocks.find((stock) => stock.id === selected.value);

        let rows = this.state.rows;
        let row = rows[rowIndex];

        _.set(row, columnKey, stock);

        this.props.columns.forEach((column) => {
            if (column.getDefaultValue) {
                let existingValue = this.getProperty(row, column);
                if (!existingValue) {
                    let isFunction = typeof column.getDefaultValue === "function";
                    let defaultValue = isFunction ? column.getDefaultValue(row) : column.getDefaultValue;
                    _.set(row, column.key, defaultValue);
                }
            }
        });

        this.onCellFocus = true;

        this.setState({
            newRowAdded: rowIndex + 1 !== rows.length,
            rows
        }, () => this.onArrowRight());

        this.onRowsChange(rows);
		}

    onRowsChange(rows) {
        if (this.props.onRowsChange) {
            setTimeout(() => this.props.onRowsChange(rows), 1);
        }
    }

    renderCell(column, columnIndex, row, rowIndex) {
        let { selectedRowIndex, selectedColumnIndex } = this.state;
        let selected = columnIndex === selectedColumnIndex && rowIndex === selectedRowIndex;

        let onCellClick = () => {
            if (!selected) {
                this.onCellFocus = true;
                let invalidRowIndexes = selectedRowIndex ? this.getInvalidRowIndexes(selectedRowIndex) : [];

                this.setState({
                    selectedColumnIndex: columnIndex,
                    selectedRowIndex: rowIndex,
                    invalidRowIndexes
                });
            }
        };

        let cellClassName = selected ? "selected" : "";
        cellClassName = column.type ? cellClassName + " " + column.type : cellClassName;

        let value = column.formula ? this.getFormulaValue(column, row) : this.getProperty(row, column);
        let cellContent = typeof column.getOptions !== "undefined" && value ? value.name : value;

        if (column.editable) { this.tabIndex++ }
        let tabIndex = this.tabIndex;

        if (selected && !this.props.disabled && column.editable) {
            cellClassName += " editing";

            let inputBasic = <Input value={cellContent}
                onChange={(event) => this.onCellEdit(column.key, rowIndex, event)}
                onKeyDown={(event) => this.onKeyDown(event)}
                ref={(input) => {this.selectedInput = input}}
                tabIndex={tabIndex} />;

            let inputDropdown = <Dropdown value={value ? value.id : null} loadOptions={column.getOptions}
                onChange={(selected) => this.onStockSelect(columnIndex, column.key, rowIndex, selected)}
                autofocus={true} onInputKeyDown={(event) => this.onKeyDown(event)}
                ref={(input) => {this.selectedDropdown = input}} />

            cellContent = typeof column.getOptions === "undefined" ? inputBasic : inputDropdown;
        } else {
            cellContent = column.type ? Formatter.format(column.type, cellContent) : cellContent;
        }

        let props = {
            key: column.key,
            tabIndex: !selected && column.editable ? tabIndex : null,
            className: cellClassName,
            onClick: onCellClick,
            onFocus: onCellClick
        }

        return <td {...props}>
            {cellContent}
        </td>;
    }

    getFormulaValue(column, argument) {
        let value = column.formula(argument);
        return Formatter.formatAmount(value);
    }

    getProperty(row, column) {
        return _.get(row, column.key);
    }

    revalidateAndGetInvalidRowIndexes() {
        let invalidRowIndexes = [];

        console.log("revalidateAndGetInvalidRowIndexes");
        console.log(this.state.rows);

        this.state.rows.forEach((row, rowIndex) => {
            invalidRowIndexes = this.validateRow(rowIndex, invalidRowIndexes);
        });
        this.setState({invalidRowIndexes});
        return invalidRowIndexes;
    }

    getInvalidRowIndexes(rowIndex) {
        return this.validateRow(rowIndex, this.state.invalidRowIndexes);
    }

    validateRow(rowIndex, invalidRowIndexes) {
        let valid = true;
        let row = this.state.rows[rowIndex];

        let index = invalidRowIndexes.indexOf(rowIndex);
        if (index > -1) {
            invalidRowIndexes.splice(index, 1);
        }

        let lastRow = rowIndex === this.state.rows.length - 1;
        let emptyAllCell = true;

        this.props.columns.forEach((column) => {
            if (column.required) {
                let value = this.getProperty(row, column);

                if (!value) {
                    valid = false;
                } else {
                    emptyAllCell = false;
                }

                if (["number", "amount"].includes(column.type) && isNaN(value)) {
                    valid = false;
                }
            }
        });

        if (!(lastRow && emptyAllCell) && !valid) {
            invalidRowIndexes.push(rowIndex);
        }
        return invalidRowIndexes;
    }

    render() {
        return <table className="ui celled table">
            {this.getHeaders()}
            {this.getBody()}
        </table>;
    }

}

export default Datatable;
