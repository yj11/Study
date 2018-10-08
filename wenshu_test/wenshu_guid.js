(function ($) {
    var GetList = function (element, option) {
        this.element = element;
        this.setting = {
            width: 600,
            height: 35
        }
        this.setting = $.extend({}, this.setting, option);
    }
    var guidCreate = function (type, index, pagesize) {
        $("#diverror").html("");
        $("#txtValidateCode").val("");
        $("#txthidtype").val(type);
        $("#txthidpage").val(index);
        $("#txthidpagesize").val(pagesize)
        var guid = createGuid() + createGuid() + "-" + createGuid() + "-" + createGuid() + createGuid() + "-" + createGuid() + createGuid() + createGuid(); //CreateGuid();
        $("#txthidGuid").val(guid);
        $("#divYzmImg").html("<img alt='���ˢ����֤�룡' name='validateCode' id='ImgYzm' onclick='ref()'  title='����л���֤��' src='/ValiCode/CreateCode/?guid=" + guid + "' style='cursor: pointer;'  />");
    }
    var createGuid = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    GetList.prototype = {
        Init: function () {
            $("#hidOrder").attr("order", "��Ժ�㼶");
            $("#hidOrder").attr("direction", "asc");
        },
        SortObj: null,
        SortCase: function (yzm, guid) {
            if (this.SortObj != null) {
                this.SortObj.BuildList(this.SortObj, 1, 5, 1, yzm, guid);
                $("#dialog").hide();
                $("#txtValidateCode").val("");
                this.SortObj = null;
            }
        },
        BuildHead: function () {
            var s = this;
            var $this = $(this.element);
            var param = $(this.setting.param);
            var datalist = "";
            var list_top = $("#sort");
            list_top.html("");
            //add by zhs 20151027 �����ղغ�����
            var $list_operate = $("#operate");
            $list_operate.html("");
            //headͷ��
            var orderlist = [{ key: '��Ժ�㼶', value: '��Ժ�㼶' }, { key: '��������', value: '��������' }, { key: '���г���', value: '���г���'}];
            for (var i = 0; i < orderlist.length; i++) {
                var key = orderlist[i].key;
                var value = orderlist[i].value;
                var $divSort;
                if (i == 0) {
                    $divSort = $("<div class=\"buttonclick\" key='desc'>" + value + "<div class=\"descico\"></div></div>");
                } else {
                    $divSort = $("<div class=\"button\" key='desc'>" + value + "<div class=\"descico\"></div></div>");
                }
                var _this = this;
                $divSort.click(function () {
                    var direction = "asc";
                    if ($(this).text() == "��Ժ�㼶") {
                        if ($(this).attr("key") == "asc") {
                            $(this).find("div:first").attr("class", "descico");
                            $(this).attr("key", "desc");
                            direction = "asc";
                        } else {
                            $(this).find("div:first").attr("class", "ascico");
                            $(this).attr("key", "asc");
                            direction = "desc";
                        }
                    } else {
                        if ($(this).attr("key") == "asc") {
                            $(this).find("div:first").attr("class", "descico");
                            $(this).attr("key", "desc");
                        } else {
                            $(this).find("div:first").attr("class", "ascico");
                            $(this).attr("key", "asc");
                        }
                        direction = $(this).attr('key');
                    }
                    $(this).parent().find("div[class='buttonclick']").attr("class", "button");
                    $(this).attr("class", "buttonclick");
                    $(this).siblings().find(".ascico").attr("class", "descico");
                    $(this).siblings().attr("key", "desc");
                    var order = $(this).text();
                    $("#hidOrder").attr("order", order);
                    $("#hidOrder").attr("direction", direction);
                    _this.SortObj = s;
                    guidCreate(7);
                    //$("#dialog").show();
                    var valiguid = $("#txthidGuid").val();
                    $.ajax({
                        url: "/ValiCode/GetCode", type: "POST", async: true,
                        data: { "guid": valiguid },
                        success: function (data) {
                            s.BuildList(s, 1, 5, 1, data, valiguid);
                        }
                    });

                });
                list_top.append($divSort);
            }
            //edit by zhs 20151027 �������ظ�Ϊ��ѡ��ѡ�е��������������
            //����б�ҳ���ذ�ť�¼�

            var $divListDownLoad = $("<div class='list-operate'><span>��������</span></div>");
            $divListDownLoad.click(function () {
                downDocList();
            });
            var $divListCollect = $("<div class='list-operate' id='listplsc'><span>�����ղ�</span></div>");
            $divListCollect.click(function () {
                collectDocList();
            });
            var $ckList = $("<input class='listck' type='checkbox' id='ckall' name='ckall'/>");
            $ckList.click(function () {
                var ckState = $("#ckall").prop("checked");
                $("input[name='ckList']").prop("checked", ckState);
            });
            $list_operate.append($ckList);
            $list_operate.append($divListCollect);
            $list_operate.append($divListDownLoad);
            //end add  kingirvin 2015-10-13
            //������
            var $divListDataCount = $("<div class=\"list_datacount\">���ҵ�<span id='span_datacount' style='color:red;'>0</span>���������ʾǰ200����<div class=\"downloadico\"></div></div>");
            list_top.append($divListDataCount);
        },
        DateTimeFormat: function (fmt, addDay, addMonth, addYear) {
            today = new Date();
            var o = {
                "M+": today.getMonth() + 1 + addMonth,                 //�·� 
                "d+": today.getDate() + addDay,                    //�� 
                "h+": today.getHours(),                   //Сʱ 
                "m+": today.getMinutes(),                 //�� 
                "s+": today.getSeconds(),                 //�� 
                "q+": Math.floor((today.getMonth() + 3) / 3), //���� 
                "S": today.getMilliseconds()             //���� 
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (today.getFullYear() + addYear + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        BuildList: function (obj, index, page, type, yzm, guid) {
            var url = window.location.href;
            var nyzm = url.indexOf("&number");
            var subyzm = url.substring(nyzm + 1);
            var n1yzm = subyzm.indexOf("&");
            var yzm1 = subyzm.substr(7, 4);

            var nyzm = url.indexOf("&guid");
            var subguid = url.substring(nyzm + 1);
            var n1guid = subguid.indexOf("&");
            var guid1 = subguid.substr(5, 35);
            if (yzm != undefined && yzm != "undefined") {
                yzm1 = yzm;
            } if (guid != undefined && guid != "undefined") {
                guid1 = guid;
            }
            var s = this;
            var $this = $(this.element);
            var param = $(this.setting.param);
            var datalist = "";
            var list_center = $("#resultList");
            list_center.html("<div style='height:25px;line-height:25px;vertical-align:middle;'><img src='/Assets/js/libs/icons/loading.gif'/><span>���ڼ��أ����Ժ�...</span></div>");
            //center�в�����
            //1.ȡ����
            var listparam = "";
            for (var i = 0; i < param.length; i++) {
                var parsplit = param[i].condition;
                listparam += parsplit + ",";
            }
            listparam = listparam.substring(0, listparam.length - 1);
            var order = $("#hidOrder").attr("order");

            //���г�������ʱ���������г�������ֶ�����
            if (order == "���г���") { order = "���г������"; }

            var direction = $("#hidOrder").attr("direction");
            var dataCount = 0;

            //edit by zhs 151124
            //�����û������ҳ����(100ҳ�󲻿��ٴη�ҳ)
            if (index > 25) {
                Lawyee.Tools.ShowMessage("���صĽ�����࣬�Ƽ�����ȷ�����������ٴβ�ѯ!");
                list_center.css("height", "500px");
                list_center.css("font-size", "18px");
                list_center.html("�޷�������������...");
                return false;
            }
            var guid1 = createGuid() + createGuid() + "-" + createGuid() + "-" + createGuid() + createGuid() + "-" + createGuid() + createGuid() + createGuid();
            var yzm1; //dzf 20180805 ��֤��ûʲô���ã�����
            //            $.ajax({
            //                url: "/ValiCode/GetCode", type: "POST", async: false,
            //                data: { "guid": guid1 },
            //                success: function (data) {
            //                    yzm1 = data;
            //                }
            //            });


            $.ajax({
                url: "/List/ListContent",
                type: "POST",
                async: true,
                data: { "Param": listparam, "Index": index, "Page": page, "Order": order, "Direction": direction, "vl5x": getKey(), "number": yzm1, "guid": guid1 },
                success: function (data) {
                    //datalist = $.parseJSON(data);

                    if (data == "remind") {
                        window.location.href = "/Html_Pages/VisitRemind20180914.html";
                    }
                    datalist = eval("(" + data + ")");

                    var currentDocId = "";
                    //2.��������
                    list_center.html("");
                    if (datalist != undefined && datalist != null) {
                        if (datalist.length > 1) {
                            dataCount = (datalist[0].Count != undefined ? datalist[0].Count : 0);
                            if (datalist[0].RunEval != undefined) {
                                eval(unzip(datalist[0].RunEval));
                            }
                            $("#span_datacount").text(dataCount);
                            var keyWordArr = new Array();
                            if (listparam != "") {
                                var paramArr = listparam.split(',');
                                for (var i = 0; i < paramArr.length; i++) {
                                    var keyWord = "";
                                    //��ȡ���������еĹؼ��ʺ�ȫ�ļ����Ĳ���ֵ�����б�ҳ��ȫ��ҳ������ʾ
                                    var paramKey = paramArr[i].split(":")[0];
                                    if (paramKey != undefined && ("�ؼ���,ȫ�ļ���,�ײ�,��ʵ,����,�о����,β��".indexOf(paramKey) >= 0)) {
                                        keyWord = paramArr[i].split(":")[1];
                                        var reg = /\s+/g;
                                        keyWord = keyWord.replace(reg, ' ');
                                        var kwarr = keyWord.split(" ");
                                        for (var m = 0; m < kwarr.length; m++) {
                                            keyWordArr.push(kwarr[m]);
                                        }
                                    }
                                }
                            }

                            //ת����ҳ�б����ݵİ�������ֵ(int��ת��string��)
                            var caseTypeStr = "", relateFiles = "";
                            for (var i = 1; i < datalist.length; i++) {
                                var key = datalist[i].����ID != undefined ? datalist[i].����ID : "";
                                var caseCourt = datalist[i].��Ժ���� != undefined ? datalist[i].��Ժ���� : "";
                                var caseNumber = datalist[i].���� != undefined ? datalist[i].���� : "";
                                var caseTypeInt = datalist[i].�������� != undefined ? datalist[i].�������� : "";
                                caseTypeStr = caseTypeStr + caseTypeInt + ",";
                                relateFiles = (relateFiles == "" ? relateFiles : (relateFiles + "~")) + key + "|" + caseCourt + "|" + caseNumber + "|" + caseTypeInt;
                            }
                            caseTypeStr = obj.GetDicValue("AJLX", caseTypeStr);
                            var caseTypeArray = caseTypeStr.split(",");

                            for (var i = 1; i < datalist.length; i++) {
                                var key = datalist[i].����ID != undefined ? datalist[i].����ID : "";
                                var caseNameTitle = datalist[i].�������� != undefined ? datalist[i].��������.replace(",", "��") : "";
                                currentDocId += key + ",";
                                title = caseNameTitle;
                                if (title == "") { continue; }
                                titleOri = caseNameTitle;
                                var caseTypeInt = datalist[i].�������� != undefined ? datalist[i].�������� : "";

                                //�����ֵ�ֵ
                                var caseType = (caseTypeArray[i - 1] != undefined ? caseTypeArray[i - 1] : "");
                                var trialRound = datalist[i].���г��� != undefined ? datalist[i].���г��� : "";

                                //���жϣ�ȡ��������ʾ
                                var style = "";
                                if (trialRound == "������������мල") { trialRound = "���" }
                                if (trialRound == "����ִ�����") { trialRound = "����" }
                                if (trialRound == "�̷����") { caseType = ""; style = "width:48px;"; }

                                if (trialRound == "����") { trialRound = ""; }
                                if (trialRound == "ִ��" && caseType == "ִ��") { trialRound = ""; }

                                var caseCourt = datalist[i].��Ժ���� != undefined ? datalist[i].��Ժ���� : "";
                                var caseNumber = datalist[i].���� != undefined ? datalist[i].���� : "";
                                var caseContent = datalist[i].DocContent != undefined ? datalist[i].DocContent : "";
                                var judgeDate = datalist[i].�������� != undefined ? datalist[i].�������� : "";
                                var notpublic = datalist[i].����������;
                                //add by zhs 151213 �������ڴ��ڵ�ǰ����ʱ���Ѳ���������Ϊ��
                                judgeDate == "0001-01-01" ? "" : judgeDate;

                                var today = new Date();

                                var dateNow = obj.DateTimeFormat("yyyy-MM-dd", 0, 0, 0);
                                if (obj.DataCompare(judgeDate, dateNow) > 0) {
                                    judgeDate = "";
                                }

                                var titleInfo = "���������ɡ�";

                                var linkA = "/content/content?DocID=" + key;
                                var keyWords = "";
                                //�������������еĹؼ��ֱ��
                                if (keyWordArr.length > 0) {
                                    keyWords = keyWordArr.join("|");
                                    linkA = "/content/content?DocID=" + key + "&KeyWord=" + keyWords;
                                    titleInfo = "�����н����";
                                    keyWord = keyWordArr[0];

                                    //��caseContentȫ��ת�����ʾ
                                    caseContent = obj.ToCDB(caseContent);
                                    //�����н���е�&#xA;���Ʒ����滻��
                                    caseContent = caseContent.replace(/&amp;#xA;/g, "");
                                    caseContent = caseContent.replace(/&amp;nbsp;/g, "");
                                    caseContent = caseContent.replace(/&amp;gt;/g, "");
                                    caseContent = caseContent.replace(/&amp;lt;/g, "");

                                    if (caseContent.indexOf(keyWord) >= 0) {
                                        var keyWordIndex = caseContent.indexOf(keyWord);
                                        var startIndex = keyWordIndex - 60;
                                        var markRedCon = "";
                                        if (startIndex <= 0) {
                                            markRedCon = markRedCon + caseContent.substr(0, keyWordIndex) + keyWord;
                                            markRedCon = markRedCon + caseContent.substr(keyWordIndex + keyWord.length, 130 - keyWordIndex);
                                        } else {
                                            markRedCon = markRedCon + caseContent.substr(keyWordIndex - 60, 60) + keyWord;
                                            markRedCon = markRedCon + caseContent.substr(keyWordIndex + keyWord.length, 60);
                                        }
                                        caseContent = "..." + markRedCon + "...";
                                    } else {
                                        caseContent = caseContent.substr(0, 130);
                                    }
                                    //�ؼ��ֱ��
                                    title = obj.KeyWordsMarkRed(title, keyWordArr);
                                    caseContent = obj.KeyWordsMarkRed(caseContent, keyWordArr);
                                } else {
                                    if (notpublic == "" || notpublic == undefined) {
                                        var cpyz = datalist[i].����Ҫּ��ԭ�� != undefined ? datalist[i].����Ҫּ��ԭ�� : "";
                                        caseContent = cpyz;
                                        caseContent = obj.ToCDB(caseContent);
                                        caseContent = caseContent.substr(0, 130) + "...";
                                    } else {
                                        titleInfo = "�����������ɡ�";
                                        caseContent = datalist[i].����������;
                                    }
                                }
                                var listitemid = "dataItem" + i;
                                if (caseContent == "" || caseContent == "...") { titleInfo = ""; caseContent = ""; }
                                var li = $("<div class=\"dataItem\" id=\"" + listitemid + "\" key=\"" + key + "\" title=\"" + titleOri + "\" caseCourt=\"" + caseCourt + "\" caseNumber=\"" + caseNumber + "\" judgeDate=\"" + judgeDate + "\">"
                                        + "<div class=\"label\">"
                                            + (caseType != "" ? ("<div class=\"ajlx_lable\">" + caseType + "</div>") : "")
                                            + (trialRound != "" ? ("<div class=\"ajlx_lable\" style=\"" + style + "\">" + trialRound + "</div>") : "")
                                        + "</div>"
                                        + "<table>"
                                            + "<tr>"
                                                + "<td colspan='2'>"
                                                    + "<div class=\"wstitle\">"
                                                    + "<input type=\"hidden\" class=\"DocIds\" value=\"" + key + "|" + titleOri + "|" + judgeDate + "\" >"
                                                    + "<input class='listck' type='checkbox' name='ckList' downloadValue=\"" + key + "|" + titleOri + "|" + judgeDate + "\"  value=\"" + key + "^" + title + "^" + caseCourt + "^" + caseNumber + "^" + judgeDate + "\"/>&nbsp;"
                                //+  "<a href='/content/contents?DocID=" + key+"'  target='_blank' style='color:Black; text-decoration:none;display:none'>" + title + "</a>"
                                                    + "<a href='javascript:void(0)' onclick='javascript:Navi(\"" + key + "\",\"" + keyWords + "\")' target='_self' style='color:Black; text-decoration:none'>" + title + "</a>"
                                                    + "</div>"
                                                + "</td>"
                                            + "</tr>"
                                             + "<tr>"
                                               + "<td colspan='2'>"
                                               + "<div class=\"fymc\">"
                                               + caseCourt
                                               + (caseNumber == "��" ? "" : ("&nbsp;&nbsp;&nbsp;&nbsp;" + caseNumber))
                                               + "&nbsp;&nbsp;&nbsp;&nbsp;"
                                               + judgeDate
                                               + "</div>"
                                               + "</td>"
                                            + "</tr>"
                                            + "<tr>"
                                               + "<td colspan='2'>"
                                               + "<div class=\"mzjg\">"
                                               + titleInfo
                                               + "</div>"
                                               + "</td>"
                                            + "</tr>"
                                            + "<tr>"
                                                + "<td class=\"wszy\" colspan='2'>"
                                                + caseContent
                                                + "</td>"
                                            + "</tr>"
                                            + "<tr>"
                                                + "<td class=\"\" colspan='2'>"
                                                + "<div id='ListItem" + (i - 1) + "'></div>"
                                                + "</td>"
                                            + "</tr>"

                                        + "</table>"
                                            + "<div class=\"scxz\">"
                                                + "<div class=\"download\">"
                                                + "<img style=\"cursor:pointer; margin-bottom:5px;\" title='ͨ���й�˾�������������֤�Ļ�Ա����Ҫ�������١���ʦ������ѧ�ߡ�����ԺУѧ���������Ƽ��������鵽�й�˾������������ȫ���Ա�ڳ�ͶƱ�����������������������Ժ˾��������' onclick=\"Casefx('" + key + "');\" src=\"/Assets/img/list/wytal-hove.png\" alt=\"ͨ���й�˾�������������֤�Ļ�Ա����Ҫ�������١���ʦ������ѧ�ߡ�����ԺУѧ���������Ƽ��������鵽�й�˾������������ȫ���Ա�ڳ�ͶƱ�����������������������Ժ˾��������\"/>"
                                                + "</div>"
                                                + "<div class=\"download\">"
                                                + "<img style=\"cursor:pointer;\" title='����' onclick=\"DownLoadCaseNew('" + listitemid + "');\" src=\"/Assets/img/list/list_download.png\" alt=\"����\"/>"
                                                + "</div>"
                                                + "<div class=\"collect\">"
                                                + "<img style=\"cursor:pointer;\" title='�ղ�'  onclick=\"CollectCaseNew('" + listitemid + "');\" src=\"/Assets/img/list/list_collect.png\"  alt=\"�ղ�\"/>"
                                                + "</div>"
                                            + "</div>"
                                + "</div>");
                                list_center.append(li);
                            }
                        } else {
                            list_center.css("height", "500px");
                            list_center.css("font-size", "18px");
                            list_center.html("�޷�������������...");
                        }
                        //��ȡ�������飬��ʾ���б���
                        list_center.render();
                        try {
                            var getGs = $("#hidConditions").val();
                            toGridsum.SearchList(getGs); //��˫
                        } catch (e)
                        { }
                        if (currentDocId != "") {
                            currentDocId = currentDocId.substring(0, currentDocId.lastIndexOf(','));
                        }
                        rfDataList = obj.GetRelateFiles(obj, relateFiles, currentDocId);

                    } else {
                        list_center.css("height", "500px");
                        list_center.css("font-size", "18px");
                        list_center.html("�޷�������������...");
                    }
                    if (type == 1) {
                        obj.BuildBottom(obj, dataCount);
                    }
                }
            });
        },
        PageObj: null,
        BuildBottom: function (obj, dataCount) {
            var list_bottom = $("#docbottom");
            list_bottom.html("");
            //��ҳbottom
            //��ҳbottom
            //var $pager = $('<div style="margin-top:20px;" id="pageNumber" class="pageNumber" total="' + dataCount + '"  pageSize="5" showSelect="true" selectDirection="bottom" centerPageNum="5" edgePageNum="0"  prevText="��һҳ" nextText="��һҳ" selectData=\'{"list":[{"key":5,"value":5},{"key":10,"value":10},{"key":15,"value":15},{"key":20,"value":20}]}\'></div>');
            //update by dongmiaonan 20180925
            var $pager = $('<div style="margin-top:20px;" id="pageNumber" class="pageNumber" total="' + dataCount + '"  pageSize="10" showSelect="false" selectDirection="bottom" centerPageNum="10" edgePageNum="0" page="0"  prevText="��һҳ" nextText="��һҳ" selectData=\'{"list":[{"key":5,"value":5},{"key":10,"value":10},{"key":15,"value":15},{"key":20,"value":20}]}\'></div>');
            $pager.attr("total", dataCount);
            list_bottom.append($pager);
            $pager.render();
            var _this = this;
            $pager.bind("pageChange", function (e, index) {
                var pageSize = $(this).attr('pageSize');
                _this.PageObj = { pageSize: pageSize, obj: obj, index: index };

                guidCreate(3, index, pageSize);
                //$("#dialog").show();
                var valiguid = $("#txthidGuid").val();
                $.ajax({
                    url: "/ValiCode/GetCode", type: "POST", async: true,
                    data: { "guid": valiguid },
                    success: function (data) {
                        var type = $("#txthidtype").val();
                        $("#txtValidateCode").val(data);
                        if (type == 3) {
                            //var pageSize = $(this).attr('pageSize');
                            var index = $("#txthidpage").val();
                            var pagesize = $("#txthidpagesize").val();
                            var url = window.location.href;
                            listObj.PageChange();
                        } else if (type == 4) {
                            var tree = $("#txthidtree").val();
                            var treekey = $("#txthidtreekey").val();
                            var url = window.location.href;
                            url = decodeURI(url);
                            var params = new Array();
                            var parameter = {
                                type: "searchWord",
                                value: treekey,
                                sign: "",
                                pid: "",
                                condition: tree + ":" + treekey
                            };
                            params.push(parameter);
                            //����URL

                            Param("treesearch", params, $("#txtValidateCode").val(), valiguid);
                        } else if (type == 5) {
                            //listObj.CheckSearch();
                            listUIKey.CheckSearch($("#txtValidateCode").val(), valiguid);
                            //Param("remove", arr);
                        } else if (type == 6) {
                            listUIKey.removeContent($("#txtValidateCode").val(), valiguid);
                        } else if (type == 7) {
                            listObj.SortCase($("#txtValidateCode").val(), valiguid);
                        } else {
                            s.Search(type, $("#txtValidateCode").val(), valiguid);
                        }

                    }
                });


                //                var pageSize = $(this).attr('pageSize');
                //                obj.BuildList(obj, index + 1, pageSize, 0);


                //                $("html,body").animate({ scrollTop: 0 }, 'fast');
            });
            $pager.bind("sizeChange", function (e, num) {
                _this.PageObj = { pageSize: num, obj: obj, index: 1 };
                guidCreate(3, 1, num);
                //$("#dialog").show();
                var valiguid = $("#txthidGuid").val();
                $.ajax({
                    url: "/ValiCode/GetCode", type: "POST", async: true,
                    data: { "guid": valiguid },
                    success: function (data) {
                        obj.BuildList(obj, 1, num, 0, data, valiguid);
                    }
                });
            });
        },
        PageChange: function (data) {
            if (this.PageObj != null) {
                var guid = $("#txthidGuid").val();
                var yzm = $("#txtValidateCode").val();
                this.PageObj.obj.BuildList(this.PageObj.obj, this.PageObj.index + 1, this.PageObj.pageSize, 0, yzm, guid);
                $("#dialog").hide();
                $("#txtValidateCode").val("");
                this.PageObj = null;

                $("html,body").animate({ scrollTop: 0 }, 'fast');
            }
        },
        GetRelateFiles: function (obj, caseInfoAll, currentDocId) {
            var dataList;
            //��ȡ��������
            var htmlStr = "";
            $.ajax({
                url: "/List/GetAllRelateFiles",
                type: "POST",
                async: true,
                data: { "caseInfoAll": caseInfoAll },
                success: function (data) {
                    try {
                        dataList = $.parseJSON(data);
                    } catch (error) {
                        dataList = "";
                    }
                    var relateFilesArray = obj.BuildRFHtml(obj, dataList, currentDocId);
                    for (var rfi = 0; rfi < relateFilesArray.length; rfi++) {
                        $("#ListItem" + rfi).html(relateFilesArray[rfi]);
                        if (htmlStr != "" && relateFilesArray[rfi] != "<table></table>") {
                            $("#ListItem" + rfi).prepend(htmlStr);
                        }
                    }
                }
            });
        },
        BuildRFHtml: function (obj, dataList, currentDocId) {
            var relateFilesArray = [];
            var arry_arrentId = currentDocId.split(',');
            if (dataList != undefined && dataList.RelateFiles != undefined && dataList.RelateFiles.length > 0) {
                for (var i = 0; i < dataList.RelateFiles.length; i++) {
                    //������������

                    var html = "<table>";
                    var relateFile = dataList.RelateFiles[i].RelateFile;
                    if ($.isArray(relateFile)) {
                        if (relateFile.length > 0) {
                            var fileType = "0"; var img = ""; var relateId = "";
                            for (var ii = 0; ii < relateFile.length; ii++) {

                                var fileTypeii = relateFile[ii].Type;
                                var judgeTime = relateFile[ii].�������� == "0001-01-01" ? "" : relateFile[ii].��������;
                                var title = "���������顿";

                                if (arry_arrentId[i] == relateFile[ii].����ID) {
                                    if (ii == 0) {
                                        img += "<img src=\"/Assets/img/list/bp_18.png\" style=\"padding-left:2px;\"/><img style=\"padding-bottom: 5px;\" src=\"/Assets/img/list/dot_10.png\"/>";
                                    } else if (ii == relateFile.length - 1 && relateFile.length == 2) {
                                        img += "<img style=\"padding-left:2px;\" src=\"/Assets/img/list/bp_18.png\"/><img style=\"margin-bottom: 10px;margin-right: 5px;\" src=\"/Assets/img/list/dot_04.png\"/>";
                                    } else if (ii < relateFile.length - 1) {
                                        img += "<img style=\"margin-bottom:10px;\" src=\"/Assets/img/list/bp_18.png\"/><img src=\"/Assets/img/list/dotLine_03.png\"/>";
                                    } else {
                                        img += "<img src=\"/Assets/img/list/bp_18.png\" style=\"padding-left:2px;\" /><img style=\"padding-right: 4px;padding-bottom: 11px;\" src=\"/Assets/img/list/dot_07.png\"/>";
                                    }

                                } else {
                                    if (ii == 0) {
                                        img += "<img style=\"padding-bottom: 5px;margin-left:10px;margin-top: 10px;\" src=\"/Assets/img/list/dot_10.png\"/>";
                                    } else if (ii < relateFile.length - 1) {
                                        img += "<img style=\"margin-left:45px\" src=\"/Assets/img/list/dotLine_03.png\"/>";
                                    } else if (ii == relateFile.length - 1 && relateFile.length == 2) {
                                        img += "<img style=\"margin-left:48px;margin-right: 5px;\" src=\"/Assets/img/list/dot_04.png\"/>";
                                    } else {
                                        img += "<img style=\"padding-right: 4px;padding-top: 8px;\" src=\"/Assets/img/list/dot_07.png\"/>";
                                    }
                                }
                            }
                            for (var ii = 0; ii < relateFile.length; ii++) {

                                var fileTypeii = relateFile[ii].Type;
                                var judgeTime = relateFile[ii].�������� == "0001-01-01" ? "" : relateFile[ii].��������;
                                var title = "���������顿";
                                if (ii > 0) {
                                    title = "";
                                }
                                var colStr = 0;
                                if (relateFile.length == 2) {
                                    colStr = relateFile.length + 1;
                                } else {
                                    colStr = relateFile.length * 2;
                                }
                                html += "<tr>";
                                html += "<td class='list-glws-title' colspan=\"2\">";
                                html += "<lable title=\"����������Ա�����¼�Ĳ�������Ϊ���ݣ�����Դ˽�������壬����ϵ�����������������Ժ��\">" + title + "</lable>";
                                html += "</td>";
                                html += "</tr>";
                                html += "<tr>";
                                if (ii == 0) {
                                    html += "<td  rowspan=" + colStr + " style=\"text-align: right;width: 70px;\"><div style=\"width: 70px;float: right; margin-bottom: 10px;\">" + img + "</div></td>";
                                }
                                if (arry_arrentId[i] == relateFile[ii].����ID) {
                                    html += "<td class='list-glws'>";
                                    html += "&nbsp;" + relateFile[ii].Mark + "";
                                    html += "&nbsp;" + relateFile[ii].����Ժ + "";
                                    html += "&nbsp;<a  title='��ƪ����' target='_blank' >" + relateFile[ii].���� + "</a>";
                                    html += "&nbsp;" + judgeTime + "";
                                    html += "&nbsp;" + relateFile[ii].�᰸��ʽ + "";
                                    html += "</td>";
                                } else {
                                    html += "<td class='list-glws'>";
                                    html += "&nbsp;" + relateFile[ii].Mark + "";
                                    html += "&nbsp;" + relateFile[ii].����Ժ + "";
                                    html += "&nbsp;<a style='text-decoration:underline;' title='����鿴ȫ��' target='_blank' href=\"/Content/Content?DocID=" + relateFile[ii].����ID + "\">" + relateFile[ii].���� + "</a>";
                                    html += "&nbsp;" + judgeTime + "";
                                    html += "&nbsp;" + relateFile[ii].�᰸��ʽ + "";
                                    html += "</td>";
                                }
                                html += "</tr>";
                                if (ii == 0) {
                                    if (relateFile[ii + 1] != undefined) {
                                        var fileTypeNext = relateFile[ii + 1].Type;
                                        if (fileTypeNext !== fileTypeii) {
                                            /*html += "<tr>";
                                            html += "<td class=\"list-glws_dot\"></td>";
                                            html += "<td class='list-glws'>";
                                            html += "<div style='margin-left:7px;height:1px;border-bottom:1px dashed #666666;'></div>";
                                            html += "</td>";
                                            html += "</tr>";
                                            fileType = fileTypeii;*/
                                        }
                                    }
                                }
                                if (ii == relateFile.length - 1 && fileTypeii != fileType) {
                                    html += "<tr>";
                                    html += "<td class=\"list-glws_dot\"></td>";
                                    html += "<td class='list-glws'>";
                                    html += "<div style='margin-left:7px;height:1px;border-bottom:1px dashed #666666;'></div>";
                                    html += "</td>";
                                    html += "</tr>";
                                    fileType = fileTypeii;
                                }

                            }
                        }
                    }
                    html += "</table>";
                    relateFilesArray.push(html);
                }
            }
            return relateFilesArray;
        },
        ToCDB: function (str) {
            //ȫ��ת��Ϊ��Ǻ��� 
            var tmp = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                    tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
                }
                else {
                    tmp += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return tmp;
        },
        DataCompare: function (a, b) {
            var arr = a.split("-");
            var starttime = new Date(arr[0], arr[1], arr[2]);
            var starttimes = starttime.getTime();

            var arrs = b.split("-");
            var lktime = new Date(arrs[0], arrs[1], arrs[2]);
            var lktimes = lktime.getTime();

            if (starttimes >= lktimes) {
                return 1;
            }
            else {
                return 0;
            }
        },
        GetDicValue: function (dicId, dicKey) {
            //��ȡ�ֵ�ֵ
            var dicValue = "";
            $.ajax({
                url: "/List/GetDicValue",
                type: "POST",
                async: false,
                data: { "dicId": dicId, "dicKey": dicKey },
                success: function (data) {
                    dicValue = data;
                }
            });
            return dicValue;
        },
        KeyWordsMarkRed: function (content, keyWordArr) {
            for (var keyi = 0; keyi < keyWordArr.length; keyi++) {
                if (content.indexOf(keyWordArr[keyi]) >= 0) {
                    eval('content = content.replace(/' + keyWordArr[keyi] + '/g, "<span style=\'color:red\'>' + keyWordArr[keyi] + '</span>")');
                }
            }
            return content;
        }
    }
    $.fn.UIList = function (option) {
        var List = new GetList(this, option);
        List.Init();
        List.BuildHead();
        //List.BuildList(List, 1, 5, 1); 
        //update by dongmiaonan 20180925
        List.BuildList(List, 1, 10, 1);
        return List;
    }
})(jQuery)
function collectDocList() {
    var getListDocIds = $("input[name='ckList']:checked");
    if (getListDocIds.length > 0) {
        var DocIds = new Array();
        var realid = "";		
        getListDocIds.each(function () {          
			var $dataitem = $(this).parents(".dataItem");
			var id = $dataitem.attr("key");
            var unzipid = unzip(id);			
            try {
                realid = com.str.Decrypt(unzipid);
                if (realid == "") {
                    setTimeout("collectDocList()", 1000); 

					return;
                } else {
                    DocIds.push(realid+"^"+$dataitem.attr("title")+"^"+$dataitem.attr("caseCourt")+"^"+$dataitem.attr("caseNumber")+"^"+$dataitem.attr("judgeDate"));
                }
            } catch (ex) {
                setTimeout("collectDocList()", 1000);
                return;
            }
        });
    }else{
		Lawyee.Tools.ShowMessage('��ѡ����Ҫ�ղص�����!');
	}
	if(DocIds.length==0){
		return;
	}
    $.ajax({
        url: "/Content/CheckLogin",
        type: "POST",
        async: false,
        data: {},
        success: function (res) {
            if (res == "0") {
                SaveUrl(); //���浱ǰurl·��
                window.location = '/User/RegisterAndLogin?Operate=1';
            } else {
                var ckChecked = $("input[name='ckList']:checked");
                var caseInfo = "";
                if (DocIds.length > 0) {
                   // $.each(DocIds,function () {
                   //     caseInfo = caseInfo + $(this) + "&";
                   // });
					caseInfo= DocIds.join("&");
                    $("#hidCaseInfo").val(caseInfo);
                    top.Dialog.confirm("�Ƿ��ղص��µİ������У�|��ʾ|�Ƿ�", function () {
                        var $conditions = $(".removeCondtion");
                        var conditions = "";
                        $conditions.each(function () {
                            conditions += $(this).attr("val") + "&";
                        });
                        conditions = conditions.substr(0, conditions.length - 1);
                        if (conditions.split('&').length >= 2) {
                            var conArry = conditions.split('&');
                            conditions = conArry[0] + conArry[1];
                        }
                        conditions = conditions.replace(/:/g, "Ϊ").replace(/&/g, "��");
                        var dates = new Date();
                        var _years = dates.getFullYear();
                        var _months = dates.getMonth() + 1;
                        var _days = dates.getDay();
                        var _hours = dates.getHours();
                        var _minutes = dates.getMinutes();
                        var _seconds = dates.getSeconds();
                        var _mill = dates.getMilliseconds();
                        var nowTimes = _years + "" + _months + "" + _days + "" + _hours + "" + _minutes + "" + _seconds + "" + _mill;
                        AddPackage(conditions + nowTimes);
                    }, function () {
                        List.Package.BindPackageList();
                        $("#divCasePackage").show();
                    });
                }
            }
        }
    });
}
function downDocList() {
    var getListDocIds = $("input[name='ckList']:checked");
    if (getListDocIds.length > 0) {
        var DownloadDocIds = new Array();
        var realid = "";
        getListDocIds.each(function () {
           	var $dataitem = $(this).parents(".dataItem");
			var id = $dataitem.attr("key");
            var unzipid = unzip(id);
            try {
                realid = com.str.Decrypt(unzipid);
                if (realid == "") {
                    setTimeout("downDocList()", 1000); return;
                } else {
                    DownloadDocIds.push(realid+"|"+$dataitem.attr("title")+"|"+$dataitem.attr("judgeDate"));
                }
            } catch (ex) {
                setTimeout("downDocList()", 1000);
                return;
            }
        });
    }else{
		Lawyee.Tools.ShowMessage('��ѡ����Ҫ���ص�����!');
	}
	if(DownloadDocIds.length==0){
		return;
	}
    if (getListDocIds.length > 0) {
        var thebody = document.body;
        var formid = 'DownloadForm';
        var url = '/CreateContentJS/CreateListDocZip.aspx?action=1';
        var theform = document.createElement('form');
        theform.id = formid;
        theform.action = url;
        theform.method = 'POST';

        //��ȡ������������Ϊѹ��������
        var $conditions = $(".removeCondtion");
        var conditions = "";
        $conditions.each(function () {
            conditions += $(this).attr("val") + "&";
        });
        conditions = conditions.substr(0, conditions.length - 1);
        conditions = conditions.replace(/:/g, "Ϊ").replace(/&/g, "��");

        var theInput = document.createElement('input');
        theInput.type = 'hidden';
        theInput.id = 'conditions';
        theInput.name = 'conditions';
        theInput.value = encodeURI(conditions);
        theform.appendChild(theInput);

        var theInput = document.createElement('input');
        theInput.type = 'hidden';
        theInput.id = 'docIds';
        theInput.name = 'docIds';
        theInput.value = DownloadDocIds.toString();
        theform.appendChild(theInput);

        //��֤�빦����δ����
        var theInput = document.createElement('input');
        theInput.type = 'hidden';
        theInput.id = 'keyCode';
        theInput.name = 'keyCode';
        theInput.value = '';
        theform.appendChild(theInput);

        thebody.appendChild(theform);
        theform.submit();
    }
}
//����7��������� ���Ƿ� 20180807
function Navi(id, keyword) {
    var unzipid = unzip(id);
    try {
        var realid = com.str.Decrypt(unzipid);
        if (realid == "") {
            setTimeout("Navi('" + id + "','" + keyword + "')", 1000);
        } else {
            var url = "/content/content?DocID=" + realid + "&KeyWord=" + encodeURI(keyword); 
            openWin(url);
        }
    } catch (ex) {
        setTimeout("Navi('" + id + "','" + keyword + "')", 1000);
    }
}
function openWin(url) {
    $('body').append($('<a href="' + url + '" target="_blank" id="openWin"></a>'))
    document.getElementById("openWin").click(); //����¼�
    $('#openWin').remove();
}