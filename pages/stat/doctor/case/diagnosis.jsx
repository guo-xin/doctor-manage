import React from 'react';
import * as global from 'util/global';

import styles from './diagnosis.less';

class Diagnosis extends React.Component {
    constructor(props) {
        super(props);
    }

    getChildren(list = []) {
        return list.map((item, index)=> {
            return (
                <tr key={index}>
                    <td></td>
                    <td className={styles.subDiagnosis}>{item.diagnosisName || '--'}</td>
                    <td>{item.diagnosisCode || '--'}</td>
                    <td>{item.creeatedTime && global.formatDate(item.creeatedTime)}</td>
                </tr>
            );
        });
    }

    render() {
        let {data=[]} = this.props;

        const list = data.map((item, index)=> {
            let children = this.getChildren(item.children);
            return (
                <tbody key={index}>
                <tr>
                    <td>{index + 1}.</td>
                    <td>{item.diagnosisName || '--'}</td>
                    <td>{item.diagnosisCode || '--'}</td>
                    <td>{ item.creeatedTime && global.formatDate(item.creeatedTime)}</td>
                </tr>
                {children}
                </tbody>
            );
        });

        let table;

        if (list.length > 0) {
            table = <table className={styles.table}>{list}</table>;
        }

        return (
            <div className={styles.wrapper}>
                { table }
            </div>
        );
    }
}


export default Diagnosis;