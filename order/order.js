//0.访问远程数据加载页面。。
//1.总体：关闭弹窗，tab栏切换
//2.买书：各个按钮的效果（不买这本，评分，查看图书），状态栏切换
//3.卖书：各个按钮的效果（下架，确认交易成功，卖给别人），状态栏切换
$(document).ready(function() {
    //关闭弹窗效果
    $(".close_btn, .cancell").click(function() {
        $(this).parents(".pop_up").hide();
    })

    //评分滑动星星效果QAQ
    $(".star").click(function() {
        $(".select").removeClass("select");
        $(this).addClass("select");
        $(this).prevAll().addClass("select");
    });

    //状态栏切换效果
    $(".state").bind("click", function() {
        $(".focus").removeClass("focus");
        $(this).addClass("focus");
    })

    //状态栏切换下面显示的切换
    $("#buy_all").click(function() {
        $("#buy_content li").show();
    })
    $("#buy_marketing").click(function() {
        $("#buy_content li").hide();
        $(".marketing_buy").show();
    })
    $("#buy_available").click(function() {
        $("#buy_content li").hide();
        $(".available_buy").show();
    })
    $("#buy_none").click(function() {
        $("#buy_content li").hide();
        $(".none_buy").show();
    })
    $("#buy_done").click(function() {
        $("#buy_content li").hide();
        $(".done_buy").show();
    })

    $("#sell_all").click(function() {
        $("#sell_content li").show();
    })
    $("#sell_marketing").click(function() {
        $("#sell_content li").hide();
        $(".marketing_sell").show();
    })
    $("#sell_available").click(function() {
        $("#sell_content li").hide();
        $(".available_sell").show();
    })
    $("#sell_done").click(function() {
        $("#sell_content li").hide();
        $(".done_sell").show();
    })

    // 加载页面
    //买书
    function buylist() {
        //删除已经创建的图书元素
        $("li").remove();

        //页面改变
        $("#buy_list").attr("class", "showing");
        $("#sell_list").attr("class", "other");
        //线滑动
        let left = $(".showing").offset().left;
        $("#line_move").animate({ left: left }, 500);
        //状态栏+主题内容切换
        $("#buy_content").css("display", "block");
        $("#sell_content").css("display", "none");
        $(".focus").removeClass("focus");
        $("#buy_all").addClass("focus");

        $.ajax({
            type: "POST",
            url: "http://pn.forseason.vip/order/info",
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                "type": "buy"
            }),
            dataType: "json",
            success: function(books) {
                console.log(books.order)
                    if (books.order == null) {
                        console.log("买书order没有数据")
                    } else {
                        let orders = books.order; //未下架的旧书数组
                        let orderNum = orders.length;
                        for (let i = 0; i < orderNum; i++) {
                            let thisbook = orders[i]; //此订单的对象
                            console.log(thisbook)

                            let status, value, btn_class, book_class;
                            if (thisbook.status == 0) { //取消交易
                                status = '状态：可购买';
                                value = '查看图书';
                                btn_class = 'buy_check_btn';
                                book_class = 'available_buy';
                            } else if (thisbook.status == 1) { //交易中
                                status = '状态：交易中';
                                value = '不买这本';
                                btn_class = 'buy_notthis_btn';
                                book_class = 'marketing_buy';
                            } else if (thisbook.status == 2) { //已完成，未评分
                                status = '状态：可评分';
                                value = '评分';
                                btn_class = 'buy_mark_btn';
                                book_class = 'done_buy';
                            } else if (thisbook.status == 3) { //已完成，已评分
                                status = '状态：已评分';
                                value = '按钮';
                                btn_class = '';
                                book_class = 'done_buy';
                            }

                            $("#buyall_content").append(`
                              <li id=${thisbook.order_Id} class=${book_class}>
                                  <div class='first_column'>
                                    <img alt='图片丢了' src='${thisbook.photo}'>
                                  </div>
                                  <div class='details'>
                                    <span class='bookname'>${thisbook.bName}</span>
                                    <span class='price'>￥${thisbook.price}</span>
                                    <span class='bookstate'>${status}</span>
                                    <input class='btn ${btn_class}' type='button' value=${value}>
                                  </div>
                              </li>
                            `)

                            if (thisbook.status == 3) {
                                $(`#${thisbook.order_Id}`).find(".btn").detach();
                            }
                        }
                    } //end else

                    if (books.withdraw == null) {
                        console.log("买书withdraw没有数据")
                    } else {
                        let withdraws = books.withdraw; //已下架的旧书数组
                        let withdrawNum = withdraws.length;
                        for (let i = 0; i < withdrawNum; i++) {
                            let thisbook = withdraws[i]; //此订单的对象
                            console.log(thisbook)
                            $("#buyall_content").append(`
                              <li class='none_buy'>
                                <div class='first_column'>
                                  <img alt='图片丢了' src='${thisbook.photo}'>
                                </div>
                                <div class='details'>
                                  <span class='bookname'>${thisbook.bName}</span>
                                  <span class='price'>￥${thisbook.price}</span>
                                  <span class='bookstate'>该书已被卖家下架</span>
                                </div>
                              </li>
                            `)
                        }
                    } //end else         
            },
            error(XMLHttpRequest, textStatus, errorThrown) {
                confirm("加载失败！");
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    }

    $("#buy_list").off("click").on("click", buylist);

    $(function() {
        buylist();
    })

    //卖书
    $("#sell_list").off("click").on("click", function() {
        //清理已有图书div
        $("li").remove();

        //页面改变
        $("#buy_list").attr("class", "other");
        $("#sell_list").attr("class", "showing");
        //线滑动
        let left = $(".showing").offset().left;
        $("#line_move").animate({ left: left }, 500);
        //状态栏+主题内容切换
        $("#sell_content").css("display", "block");
        $("#buy_content").css("display", "none");
        $(".focus").removeClass("focus");
        $("#sell_all").addClass("focus");

        $.ajax({
            type: "POST",
            url: "http://pn.forseason.vip/order/info",
            xhrFields: {
                withCredentials: true
            },
            contentType: false,
            data: JSON.stringify({
                "type": "sell"
            }),
            dataType: "json",
            success: function(books) {
                console.log("卖书order" + books)
                if (books === undefined) {
                    console.log("卖书没有数据")
                } else {
                    for (let i = 0; i < books.length; i++) {
                        let thisbook = books[i]; //此订单的对象
                        console.log("thisbook" + thisbook)
                        if (thisbook.status == 0) {
                            //
                        } else {
                            let status, value, btn_class, book_class;
                            if (thisbook.status == 1) { //可购买
                                status = '状态：可购买';
                                value = '下架';
                                btn_class = 'sell_withdraw_btn';
                                book_class = 'available_sell';
                            } else if (thisbook.status == 2) { //交易中
                                status = '状态：交易中';
                                value = '确认交易成功';
                                btn_class = 'sell_ensure_btn';
                                book_class = 'marketing_sell';
                            } else if (thisbook.status == 3) { //已售出
                                status = '状态：已售出';
                                value = '';
                                book_class = 'done_sell';
                            }

                            $("#sellall_content").append(
                                `<li id='${thisbook.book_Id}' class='${book_class}'>
                                    <div class='first_column'>
                                        <img alt='图片丢了' src='${thisbook.photo}'>
                                    </div>
                                    <div class='details'>
                                        <span class='bookname'>${thisbook.bName}</span>
                                        <span class='price'>￥${thisbook.price}</span>
                                        <span class='bookstate'>${status}</span>
                                        <input type='button' class='btn ${btn_class}' value=${value} onClick='check()'>
                                    </div>
                                    </li>`
                            )

                            if (thisbook.status == 2) {
                                $(`#${thisbook.book_Id}`).find("input[type='button']").after(`
                                    <input class='btn sell_resell_btn' type='button' value='卖给别人'>
                                    `)
                            } else if (thisbook.status == 3) {
                                $(`#${thisbook.book_Id}`).find("input[type='button']").detach();
                            }
                        } //end 判断是不是下架书记的else
                    } //end判断是不是空的else

                } //end while    
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                confirm("加载失败！")
                console.log(XMLHttpRequest)
                console.log(textStatus)
                console.log(errorThrown)
            }
        })
    })

    // 弹窗、按钮处理
    //买书
    //不买这本
    $("#buyall_content").on("click", ".buy_notthis_btn", function() {
        let this_ele = $(this).parents("li");
        $("#notbuy_pop").show();
        let orderId = $(this_ele).attr("id");

        //点击确定按钮
        $("#notbuy_yes").off("click").on("click", function() {
            $.ajax({
                type: "PUT",
                url: "http://pn.forseason.vip/order/cancel",
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify({
                    "type": "buy",
                    "order_id": `${orderId}`,
                }),
                success: function(data) {
                    //弹窗
                    $("#notbuy_pop").hide();
                    confirm("取消成功！");
                    //改变元素
                    $(this_ele).find(".bookstate").html("状态：可购买");
                    $(this_ele).find(".buy_notthis_btn").detach();
                    let input = $("<input class='btn buy_check_btn' type='button' value='查看图书'>");
                    $(this_ele).find(".bookstate").after(input);
                    $(this_ele).attr("class", "available_buy")
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#notbuy_pop").hide();
                    confirm("取消失败！")
                    console.log(XMLHttpRequest)
                    console.log(textStatus)
                    console.log(errorThrown)
                }
            })
        })
    })

    //评分
    $("#buyall_content").on("click", ".buy_mark_btn", function() {
        let this_ele = $(this).parents("li");
        console.log(this_ele.attr("class"))
        $("#mark_pop").show();

        let orderId = $(this_ele).attr("id");
        let name = this_ele.find(".bookname").html();
        $("#mark_bookname").html(`${name}`);

        $(".star").click(function() {
            $(".select").removeClass("select");
            $(this).addClass("select");
            $(this).prevAll().addClass("select");
            let number = $(this).attr("id");
            console.log(number)
            let marks;
            if (number == "two") marks = 1;
            else if (number == "four") marks = 2;
            else if (number == "six") marks = 3;
            else if (number == "eight") marks = 4;
            else if (number == "ten") marks = 5;
            console.log(marks)

            $("#mark_btn").off("click").on("click", function() {
                $.ajax({
                    type: "PUT",
                    url: "http://pn.forseason.vip/user/credit",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: JSON.stringify({
                        "order_Id": `${orderId}`,
                        "credit": `${marks}`,
                    }),
                    success: function(data) {
                        //关闭弹窗
                        $("#mark_pop").hide();
                        $(".select").removeClass("select");
                        //去掉评分按钮和状态
                        $(this_ele).find(".buy_mark_btn").detach();
                        $(this_ele).find(".bookstate").html(`您的评分为：${marks}分`);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        $("#mark_pop").hide();
                        $(".select").removeClass("select");
                        confirm("评分失败！")
                        console.log(XMLHttpRequest)
                        console.log(textStatus)
                        console.log(errorThrown)
                    }
                })
            })
        })
    })

    //点击“查看详情”查看图书
    $("#buyall_content").on("click", ".buy_check_btn", function() {
        //设置localstorage
        let book_id = $(this).parents("li").attr("id");
        localStorage.setItem("book_id", `${book_id}`)
            //跳转
        window.location.href = "book_detail.html";
    })

    //点击图书图片查看图书
    $(".content").on("click", "li .first_column", function() {
        //设置localstorage
        let book_id = $(this).parents("li").attr("id");
        localStorage.setItem("book_id", `${book_id}`)
            //跳转
        window.location.href = "book_detail.html";
    })

    //卖书
    //确认交易成功
    $("#sellall_content").on("click", ".sell_ensure_btn", function() {
        console.log("press 确认交易成功")
        let this_ele = $(this).parents("li");
        let bookId = $(this_ele).attr("id");

        $("#ensure_pop").show();

        $("#ensure_yes").click(function() {
            $.ajax({
                type: "PUT",
                url: "http://pn.forseason.vip/order/success",
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify({
                    "book_id": `${bookId}`
                }),
                success: function(data) {
                    //改变状态
                    $(this_ele).find(".bookstate").html("状态：已售出");
                    $(this_ele).find("input").detach();
                    $(this_ele).attr("class", "done_sell");
                    //弹窗
                    $("#ensure_pop").hide();
                    confirm("确认成功！")
                        //跳转页面
                    let page = $(".focus").attr("id");
                    if (page == "sell_marketing") {
                        $("#sell_content li").hide();
                        $(".done_sell").show();
                        $(".focus").removeClass("focus");
                        $("#sell_done").addClass("focus");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#ensure_pop").hide();
                    confirm("确认失败！")
                    console.log(XMLHttpRequest)
                    console.log(textStatus)
                    console.log(errorThrown)
                }
            })
        })
    })

    //卖给别人
    $("#sellall_content").on("click", ".sell_resell_btn", function() {
        let this_ele = $(this).parents("li");
        let bookId = $(this_ele).attr("id");

        $("#change_pop").show();

        $("#change_yes").click(function() {
            $.ajax({
                type: "PUT",
                url: "/order/cancel",
                data: JSON.stringify({
                    "type": "sell",
                    "order_id": `${bookId}`
                }),
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    //改变状态
                    $(this_ele).find(".bookstate").html("状态：可购买");
                    $(this_ele).find("input").detach();
                    let input = $("<input class='shape sell_withdraw_btn' type='button' value='下架'>");
                    $(this_ele).find(".bookstate").after(input);
                    $(this_ele).attr("class", "available_sell");
                    //弹窗
                    $("#change_pop").hide();
                    confirm("取消成功！")
                        //跳转页面
                    let page = $(".focus").attr("id");
                    if (page == "sell_marketing") {
                        $("#sell_content li").hide();
                        $(".available_sell").show();
                        $(".focus").removeClass("focus");
                        $("#sell_available").addClass("focus");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#change_pop").hide();
                    confirm("取消失败！")
                    console.log(XMLHttpRequest)
                    console.log(textStatus)
                    console.log(errorThrown)
                }
            })
        })
    })

    //下架
    $("#sellall_content").on("click", ".sell_withdraw_btn", function() {
        console.log(1)
        let this_ele = $(this).parents("li");
        console.log($(this_ele).attr("id"))
        let bookId = $(this_ele).attr("id");
        $("#withdraw_pop").show();

        $("#withdraw_yes").off("click").on("click", function() {
            $.ajax({
                type: "PUT",
                url: "http://pn.forseason.vip/book/back",
                data: JSON.stringify({
                    "book_id": `${bookId}`
                }),
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    $("#withdraw_pop").hide();
                    $("#withdraw_succeed").show();
                    $(this_ele).remove();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#withdraw_pop").hide();
                    confirm("下架失败！")
                    console.log(XMLHttpRequest)
                    console.log(textStatus)
                    console.log(errorThrown)
                }
            })
        })
    })
});