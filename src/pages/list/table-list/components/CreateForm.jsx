import { Form, Input, Modal } from 'antd';
import React from 'react';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateForm = props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    mode,
    selectedValues,
    handleUpdate,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      mode === 'ADD' && handleAdd(fieldsValue);
      mode === 'EDIT' && handleUpdate({ ...fieldsValue, key: selectedValues.key });
    });
  };

  return (
    <Modal
      width={600}
      destroyOnClose
      title={mode === 'ADD' ? '新建' : '编辑'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目名">
        {form.getFieldDecorator('name', {
          initialValue: selectedValues.name || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          initialValue: selectedValues.desc || '',
          rules: [{}],
        })(<TextArea placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="官网">
        {form.getFieldDecorator('website', {
          initialValue: selectedValues.website || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="合约地址">
        {form.getFieldDecorator('contract', {
          initialValue: selectedValues.contract || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="精度">
        {form.getFieldDecorator('precision', {
          initialValue: selectedValues.precision || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手续费">
        {form.getFieldDecorator('fee', {
          initialValue: selectedValues.fee || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="最小交易量">
        {form.getFieldDecorator('minTrading', {
          initialValue: selectedValues.minTrading || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
        {form.getFieldDecorator('tel', {
          initialValue: selectedValues.tel || '',
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
