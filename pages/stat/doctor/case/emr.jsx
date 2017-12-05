import React from 'react';
import {Form, Input, Checkbox, Icon, InputNumber} from 'antd';
import Diagnosis from './Diagnosis';
import styles from './emr.less';

const FormItem = Form.Item;

class Emr extends React.Component {

    getValue(data, key) {
        if (data[key] && data[key][0]) {
            return data[key][0];
        }
        return {};
    }

    getData(data = {}) {
        let formattedData = {
            pc: data.illnessState || undefined,
            hpc: this.getValue(data, 'historyPresentList').remark || undefined,
            pmh: this.getValue(data, 'historyPastList').description || undefined,
            allergies: this.getValue(data, 'historyPastList').allergies || undefined,
            hasDrugAllergyHistory: this.getValue(data, 'historyPastList').status === 1 ? true : false,
            physicalExamination: this.getValue(data, 'physicalExaminationList').userProfile,
            temperature: this.getValue(data, 'physicalExaminationList').temperature,
            lowPressure: this.getValue(data, 'physicalExaminationList').lowPressure,
            highPressure: this.getValue(data, 'physicalExaminationList').highPressure,
            breath: this.getValue(data, 'physicalExaminationList').breath,
            pulse: this.getValue(data, 'physicalExaminationList').pulse,
            auxiliaryExamination: this.getValue(data, 'auxiliaryExaminationsList').resultDesc || undefined,
            opinions: data.opinions
        };

        return formattedData;
    }


    render() {
        const {caseData={},options=''} = this.props;

        let {
            pc='--', hpc='--', pmh='--', allergies='--', temperature='--',
            pulse='--', breath='--', lowPressure='--', highPressure='--', physicalExamination='--', auxiliaryExamination='--', hasDrugAllergyHistory
        } = this.getData(caseData);

        return (
            <div className={styles.wrapper}>
                <div className={styles.panelHead}>
                    <div className={styles.panelTitle}>
                        病历
                    </div>
                </div>
                <div className={styles.panelBody}>
                    <Form form={this.props.form}>
                        <FormItem
                            label="主　诉">
                            {pc || '--'}
                        </FormItem>

                        <FormItem
                            label="现病史">
                            <pre>{hpc || '--'}</pre>
                        </FormItem>

                        <FormItem>
                            <FormItem
                                label="既往史">
                                <pre>{pmh}</pre>
                            </FormItem>

                            <div className={styles.pmhDetail}>
                                <span>药物过敏史:</span>
                                {(hasDrugAllergyHistory ? <span>{allergies}</span> : <span>--</span>) }
                            </div>
                        </FormItem>

                        <FormItem
                            label="体格检查(用户描述)">
                            <div className={styles.physicalExamination}>
                                <FormItem label="体温">{(temperature || '--')}
                                    <span className="ant-form-text"> ℃</span>
                                </FormItem>

                                <FormItem label="脉搏">{(pulse || '--')}
                                    <span className="ant-form-text"> 次/分</span>
                                </FormItem>

                                <FormItem label="呼吸">{(breath || '--')}
                                    <span className="ant-form-text"> 次/分</span>
                                </FormItem>

                                <FormItem
                                    label="血压">{(lowPressure || '--')} / {(highPressure || '--')}
                                    <span className="ant-form-text"> mmHg</span>
                                </FormItem>
                            </div>
                            <pre>{physicalExamination || '--'}</pre>
                        </FormItem>
                        <FormItem
                            label="辅助检查结果">
                            <pre>{auxiliaryExamination}</pre>
                        </FormItem>

                        <FormItem
                            label="诊断">
                            <Diagnosis data={caseData.diagnosisList || []}></Diagnosis>
                        </FormItem>

                        <FormItem
                            label="诊疗意见">
                            <pre>{options || '--'}</pre>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

Emr = Form.create()(Emr);

export default Emr;