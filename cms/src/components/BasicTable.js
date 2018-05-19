import _ from 'lodash'
import React from 'react'

import Formatter from '../core/Formatter'
import Button from './Button'

class BasicTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
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
        let rows = this.props.rows;
        let rowComponents = [];

        if (rows) {
            rowComponents = rows.map((row, rowIndex) => this.getRow(row, rowIndex));
        }
        return <tbody>{rowComponents}</tbody>;
    }

    getRow(row, rowIndex) {
        let cells = this.props.columns.map((column, columnIndex) => {
            return this.renderCell(column, columnIndex, row, rowIndex);
        });

        return <tr key={rowIndex}>
            {cells}
            {this.getDeleteCell(rowIndex)}
        </tr>;
    }

    getDeleteCell(rowIndex) {
        if (this.props.allowedDelete && !this.props.disabled) {
            let deleteClick = () => {
                console.log("Deleting..", rowIndex);
            };

            return <td>
                <Button icon="trash" className="ui icon button mini" data-tooltip="Remove Item" onClick={deleteClick}></Button>
            </td>;
        }
        return null;
    }

    renderCell(column, columnIndex, row, rowIndex) {
        let cellClassName = "";
        cellClassName = column.type ? cellClassName + " " + column.type : cellClassName;

        let value = column.formula ? this.getFormulaValue(column, row) : this.getProperty(row, column);
        let cellContent =  column.type ? Formatter.format(column.type, value) : value;

        let props = { key: column.key, className: cellClassName };
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

    render() {
        return <table className="ui celled table">
            {this.getHeaders()}
            {this.getBody()}
        </table>;
    }

}

export default BasicTable;
