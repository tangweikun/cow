import { Button, Card, Form, Modal, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const { confirm } = Modal;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ listAndtableList, loading }) => ({
  listAndtableList,
  loading: loading.models.listAndtableList,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    selectedValues: {},
    mode: 'ADD',
  };

  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '项目名',
      dataIndex: 'name',
    },
    {
      title: '简介',
      dataIndex: 'desc',
    },
    {
      title: '官网',
      dataIndex: 'website',
    },
    {
      title: '合约地址',
      dataIndex: 'contract',
    },
    {
      title: '精度',
      dataIndex: 'precision',
    },
    {
      title: '手续费',
      dataIndex: 'fee',
    },
    {
      title: '最小交易量',
      dataIndex: 'minTrading',
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              this.setState({ selectedValues: record, modalVisible: true, mode: 'EDIT' });
            }}
          >
            编辑
          </Button>
          <Button
            type="danger"
            onClick={e => {
              const that = this;
              confirm({
                title: '您确定要删除该记录吗',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                  that.handleMenuClick(record.key);
                  message.success('删除成功');
                },
              });
            }}
          >
            删除
          </Button>
          {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <a href="">删除</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndtableList/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndtableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listAndtableList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndtableList/remove',
      payload: {
        key: [key],
      },
      callback: () => {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'listAndtableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndtableList/add',
      payload: {
        name: fields.name,
        desc: fields.desc,
        website: fields.website,
        contract: fields.contract,
        precision: fields.precision,
        fee: fields.fee,
        minTrading: fields.minTrading,
        tel: fields.tel,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    console.log(fields);
    dispatch({
      type: 'listAndtableList/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
        website: fields.website,
        contract: fields.contract,
        precision: fields.precision,
        fee: fields.fee,
        minTrading: fields.minTrading,
        tel: fields.tel,
      },
    });
    message.success('更新成功');
    this.setState({ modalVisible: false });
  };

  render() {
    const {
      listAndtableList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  this.handleModalVisible(true);
                  this.setState({ mode: 'ADD', selectedValues: {} });
                }}
              >
                新建
              </Button>
            </div>
            <StandardTable
              bordered
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          handleUpdate={this.handleUpdate}
          mode={this.state.mode}
          selectedValues={this.state.selectedValues}
          modalVisible={modalVisible}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
