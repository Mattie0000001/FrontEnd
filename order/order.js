//0.访问远程数据加载页面。。
//1.总体：关闭弹窗，tab栏切换
//2.买书：各个按钮的效果（不买这本，评分，查看图书），状态栏切换
//3.卖书：各个按钮的效果（下架，确认交易成功，卖给别人），状态栏切换
$(document).ready(function() {
    //关闭弹窗效果
    $(".close_btn, .cancell").click(function() {
        $(this).parents(".pop_up").hide();
    })

    //状态栏切换效果
    $(".state").bind("click",function() {
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
            type: "GET",
            url: "/buyorder",
            headers: {
                "content-type": "application/json"
            },
            success: function(books) {
                console.log("买书order" + books)
                if (books == null) {
                    console.log("买书没有数据")
                } else {
                    if (books.order == null) {
                        console.log("买书order没有数据")
                    } else {
                        let orders = books.order; //未下架的旧书数组
                        let orderNum = orders.length;
                        for (let i = 0; i < orderNum; i++) {
                            let thisbook = orders[i]; //此订单的对象
                            console.log(thisbook)
                            let newBook = $(`<li id=${thisbook.order_Id}></li>`);
                            let imgDiv = $("<div class='first_column'></div>");
                            let img = $(`<img height='110px' width='110px' alt='无法显示' src='${thisbook.photo}'>`);
                            let detailDiv = $("<div class='details'></div>");
                            let nameSpan = $(`<span class='bookname'>${thisbook.bName}</span>`);
                            let priceSpan = $(`<span class='price'>￥${thisbook.price}</span>`);
                            let stateSpan = $("<span class='bookstate'></span>");
                            let button = $("<input class='shape' type='button' value='按钮'>");
    
                            $("#buyall_content").append(newBook);
                            $(newBook).append(imgDiv);
                            $(newBook).append(detailDiv);
                            $(imgDiv).append(img);
                            $(detailDiv).prepend(nameSpan);
                            $(nameSpan).after(priceSpan);
                            $(priceSpan).after(stateSpan);
                            $(stateSpan).after(button);
                            
                            if (thisbook.status == 0) { //取消交易
                                $(stateSpan).html("状态：可购买");
                                $(button).attr("value", "查看图书");
                                $(button).addClass("buy_check_btn");
                                $(newBook).addClass("available_buy");
                            } else if (thisbook.status == 1) { //交易中
                                $(stateSpan).html("状态：交易中");
                                $(button).attr("value", "不买这本");
                                $(button).addClass("buy_notthis_btn");
                                $(newBook).addClass("marketing_buy");
                            } else if (thisbook.status == 2) { //已完成，未评分
                                $(stateSpan).html("状态：可评分");
                                $(button).attr("value", "评分");
                                $(button).addClass("buy_mark_btn");
                                $(newBook).addClass("done_buy");
                            } else if (thisbook.status == 3) { //已完成，已评分
                                $(newBook).addClass("done_buy");
                                $(button).detach();
                                $(stateSpan).html("状态： 已评分 ");
                            }
                        }                   
                    }//end else

                    if (books.withdraw == null) {
                        console.log("买书withdraw没有数据")
                    } else {
                        let withdraws = books.withdraw; //已下架的旧书数组
                        let withdrawNum = withdraws.length;
                        for (let i = 0; i < withdrawNum; i++) {
                            let thisbook = withdraws[i]; //此订单的对象
                            console.log(thisbook)
                            let newBook = $("<li class='none_buy'></li>");
                            let imgDiv = $("<div class='first_column'></div>");
                            let img = $(`<img height='110px' width='110px' alt='无法显示' src='${thisbook.photo}'>`);
                            let detailDiv = $("<div class='details'></div>");
                            let nameSpan = $(`<span class='bookname'>${thisbook.bName}</span>`);
                            let priceSpan = $(`<span class='price'>￥${thisbook.price}</span>`);
                            let stateSpan = $("<span class='bookstate'>该书已被卖家下架</span>");
                          
                            $("#buyall_content").append(newBook);
                            $(newBook).append(imgDiv);
                            $(newBook).append(detailDiv);
                            $(imgDiv).append(img);
                            $(detailDiv).prepend(nameSpan);
                            $(nameSpan).after(priceSpan);
                            $(priceSpan).after(stateSpan);
                        }
                    }//end else         
                }//end else
            },
            error(XMLHttpRequest, textStatus, errorThrown) {
                $("#error_pop").show();
                console.log(XMLHttpRequest)
                console.log(textStatus)
                console.log(errorThrown)
            }
        })
    }

    $("#buy_list").off("click").on("click", buylist);

    $(function() {
        buylist();
    })

    //卖书
    $("#sell_list").off("click").on("click", function() {
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
            type: "GET",
            url: "/sellorder",
            headers: {
                "content-type": "application/json"
            },
            success: function(orders) {
                console.log("卖书order" + orders)
                if (orders == null) {
                    console.log("卖书没有数据")
                } else {
                    let orderNum = orders.length;
                    for (let i = 0; i < orderNum; i++) {
                        let thisbook = orders[i]; //此订单的对象
                        console.log("thisbook"+thisbook)
                        let newBook = $(`<li id='${thisbook.book_Id}'></li>`);
                        let imgDiv = $("<div class='first_column'></div>");
                        let img = $(`<img height='110px' width='110px' alt='无法显示' src='${thisbook.photo}'>`);
                        let detailDiv = $("<div class='details'></div>");
                        let nameSpan = $(`<span class='bookname'>${thisbook.bName}</span>`);
                        let priceSpan = $(`<span class='price'>￥${thisbook.price}</span>`);
                        let stateSpan = $("<span class='bookstate'></span>");
                        let button = $("<input class='shape' type='button' value='按钮'>");

                        $("#sellall_content").append(newBook);
                        $(newBook).append(imgDiv);
                        $(newBook).append(detailDiv);
                        $(imgDiv).append(img);
                        $(detailDiv).prepend(nameSpan);
                        $(nameSpan).after(priceSpan);
                        $(priceSpan).after(stateSpan);
                        $(stateSpan).after(button);
                       
                        if (thisbook.status == 1) { //可购买
                            $(stateSpan).html("状态：可购买");
                            $(button).attr("value", "下架");
                            $(button).addClass("sell_withdraw_btn");
                            $(newBook).addClass("available_sell");
                        } else if (thisbook.status == 2) { //交易中
                            $(stateSpan).html("状态：交易中");
                            $(button).attr("value", "确认交易成功");
                            $(button).addClass("sell_ensure_btn");
                            $(newBook).addClass("marketing_sell");
                            let button2 = $("<input class='shape sell_resell_btn' type='button' value='卖给别人'>");
                            $(button).after(button2);
                        } else if (thisbook.status == 3) { //已售出
                            $(stateSpan).html("状态：已售出");
                            $(button).detach();
                            $(newBook).addClass("done_sell");
                        }
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $("#error_pop").show();
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
                url: `/buy/cancel/${orderId}/`,
                headers: {
                    "content-type": "application/jason"
                },
                success: function() {
                    //关闭弹窗
                    $("#notbuy_pop").hide();
                    //改变元素
                    $(this_ele).find(".bookstate").html("状态：可购买");
                    $(this_ele).find(".buy_notthis_btn").detach();
                    let input = $("<input class='shape buy_check_btn' type='button' value='查看图书'>");
                    $(this_ele).find(".bookstate").after(input);
                    //改变书的状态
                    $(this_ele).attr("class", "available_buy");
                },
                error: function() {
                    $("#error_pop").show();
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

        $("img").click(function() {
            let $star = $(event.target);
            let number = $star.attr("id");
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
                    type: "POST",
                    url: "/buy/score/",
                    headers: {
                        "content-type": "application/json"
                    },
                    data: JSON.stringify({
                        order_Id: orderId,
                        credit: marks
                    }),
                    success: function() {
                        //关闭弹窗
                        $("#mark_pop").hide();
                        //去掉评分按钮和状态
                        $(this_ele).find(".buy_mark_btn").detach();
                        $(this_ele).find(".bookstate").html(`您的评分为：${marks}分`);
                    },
                    error: function() {
                        $("#error_pop").show();
                    }
                })
            })
        })
    })

    //查看图书
    $("#buyall_content").on("click", ".buy_check_btn", function() {
        window.location.href = "url";
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
                url: `/sellorder/sure/${bookId}/`,
                success: function() {
                    $("#ensure_pop").hide();
                    //改变状态
                    $(this_ele).find(".bookstate").html("状态：已售出");
                    $(this_ele).find("input").detach();
                    $(this_ele).attr("class", "done_sell");
                    //跳转页面
                    let page = $(".focus").attr("id");
                    if (page == "sell_marketing") {
                        $("#sell_content li").hide();
                        $(".done_sell").show();
                        $(".focus").removeClass("focus");
                        $("#sell_done").addClass("focus");
                    }
                },
                error: function(res) {
                    console.log(res.responseText, res.status)
                    $("#error_pop").show();
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
                url: `sell/cancell/${bookId}/`,
                success: function() {
                    $("#change_pop").hide();
                    $(this_ele).find(".bookstate").html("状态：可购买");
                    $(this_ele).find("input").detach();
                    let input = $("<input class='shape sell_withdraw_btn' type='button' value='下架'>");
                    $(this_ele).find(".bookstate").after(input);
                    $(this_ele).attr("class", "available_sell");
                    //跳转页面
                    let page = $(".focus").attr("id");
                    if (page == "sell_marketing") {
                        $("#sell_content li").hide();
                        $(".available_sell").show();
                        $(".focus").removeClass("focus");
                        $("#sell_available").addClass("focus");
                    }
                },
                error: function() {
                    $("#error_pop").show();
                }
            })
        })
    })

    //下架
    $("#sellall_content").on("click", ".sell_withdraw_btn", function() {
        let this_ele = $(this).parents("li");
        $("#withdraw_pop").show();
        let bookId = $(this_ele).attr("id");

        $("#withdraw_yes").off("click").on("click", function() {
            $.ajax({
                type: "PUT",
                url: `sell/withdraw/${bookId}/`,
                success: function() {
                    $("#withdraw_pop").hide();
                    $("#withdraw_succeed").show();
                    $(this_ele).remove();
                },
                error: function() {
                    $("#error_pop").show();
                }
            })
        })
    })

});