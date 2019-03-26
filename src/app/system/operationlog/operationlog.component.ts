import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SERVER_API_URL} from '../../app.constants';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';


declare var $: any;
declare var jQuery: any;
declare var swal: any;


@Component({
  selector: 'app-operationlog',
  templateUrl: './operationlog.component.html',
  styleUrls: ['./operationlog.component.css']
})
export class OperationlogComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    searchForm: FormGroup;
    olId: string = '';
    saveForm: FormGroup;
    mr: NgbModalRef;
    titleName:string;
  constructor(private fb: FormBuilder, private modalService: NgbModal,private http: HttpClient) {

      this.searchForm = this.fb.group({
          "srAppName":'',
          "olLogs":'',
          "startEndTime":''
      });

  }

  ngOnInit() {

      this.dateRangePickers();

      const that = this;
      this.dtOptions = {
          searching: false,
          serverSide: true,
          processing: true,
          ordering: false,
          ajax: (dataTablesParameters: any, callback) => {
              that.http.post<DataTablesResponse>(
                  SERVER_API_URL + 'systemoperation/api/getAllOperationLogs' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                  this.searchForm.value, {}
              ).subscribe(resp => {
                  callback({
                      recordsTotal: resp.recordsTotal,
                      recordsFiltered: resp.recordsFiltered,
                      data: resp.data
                  });
              });
          },
          columns: [ {
              title: '应用名称',
              data: 'searchResults',
              render: function (data, type, row) {
                  var b='';
                  if(null!=data){
                      b=data.srAppName;
                  }
                  return b;
              }
          }, {
              title: '操作日志',
              data: 'olLogs'
          }, {
              title: '操作时间',
              data: 'createDate',
              render: function (data, type, row) {
                  return that.getFomateDate(data);
              }
          }
          ],
          rowCallback(row: Node, data: any[] | Object, index: number) {
              $('td', row).unbind('click');
              $('td', row).bind('click', function () {
                  that.someClick(data);
                  $('td', row).parent().siblings().removeAttr('style');
                  $('td', row).parent().css('background', '#868e96');
              });
              return row;
          },
          language: {
              'emptyTable': '没有数据',
              'loadingRecords': '加载中...',
              'processing': '查询中...',
              'search': '搜索:',
              'lengthMenu': '每页 _MENU_ 条',
              'zeroRecords': '没有数据',
              'info': '第 _START_ 条 到 _END_ 条/共有 _TOTAL_ 条',
              'infoEmpty': '没有数据',
              'infoFiltered': '(过滤总件数 _MAX_ 条)',
              'paginate': {
                  'first': '第一页',
                  'last': '最后一页',
                  'next': '下一页',
                  'previous': '上一页',
              }
          }
      };
  }

    //获取绑定事件
    someClick(info: any) {
        this.olId = info.id;
    }

    //将时间戳格式化
    private getFomateDate(time) {
        if (typeof(time) == 'undefined') {
            return '';
        }
        var oDate = new Date(time),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间

        return oTime;
    };

    //补0操作,当时间数据小于10的时候，给该数据前面加一个0
    private getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }



    dateRangePickers() {
        const that = this;
        const picker: any = $('#startEndTime');
        const dataRageOption: Object = {
            'timePicker': false,
            'timePicker24Hour': false,
            'autoUpdateInput': false,
            'drops': 'down',
            'opens': 'left',
            'ranges': {
                '清空': ['', ''],
                '今日': [moment().startOf('day'), moment().subtract('days', -1).endOf('day')],
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().startOf('day')],
                '最近7日': [moment().subtract('days', 5), moment().subtract('days', -1).endOf('day')],
                '最近30日': [moment().subtract('days', 28), moment().subtract('days', -1).endOf('day')]
            },
            'locale': {
                'format': 'YYYY-MM-DD',
                'separator': ' / ',
                'applyLabel': '应用',
                'cancelLabel': '取消',
                'fromLabel': 'From',
                'resetLabel': '重置',
                'toLabel': 'To',
                'customRangeLabel': '自定义',
                'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
                'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '7月', '八月', '九月', '十月', '十一月', '十二月'],
                'firstDay': 1
            }
        };
        picker.daterangepicker(dataRageOption, function (start, end, label) {
            //日期是否为空
            if (this.startDate._isValid == false || this.endDate._isValid == false) {
                that.searchForm.patchValue({
                    startEndTime: ''
                });
                this.startDate = moment().subtract('days', 2).endOf('day');
                this.endDate = moment().startOf('day');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                that.searchForm.patchValue({
                    startEndTime: this.element.val()
                });
            }

        });

    }

    search() {
        //清空id
        this.olId = '';
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

}
