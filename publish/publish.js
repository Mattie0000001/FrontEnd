$(document).ready(function () {
  //返回首页
  $("#title img").click(function () {
    window.location.href = "../home/html/home.html";
  })

  //上传图片
  $("#upload").change(function () {
    let files = $("#upload").prop("files");
    let image = files[0];
    console.log(1+image)
    console.log(2+document.getElementById("upload").files[0])
    let reader = new FileReader();
    reader.readAsDataURL(image);
    console.log(3+image)
    reader.onload = function(){
      let url = this.result;
      $("#photo").attr("src", url);
      $("#pop").show();
    }
  }) 

  //提交表单 
  $("#submit").click(function () { 
    var data = new FormData();
    let bname = $("#bookName").val();
    let price = $("#price").val();
    let major = $("#major").val();
    let grade = $("#grade").find("option:selected").val();
    let old = $("#old").find("option:selected").val();
    let describe = $("#describe").val();
    let files = $("#upload").prop("files");
    let image = files[0];

    console.log("image"+image)

    if (image == undefined) {
      $("#pop").show();
      $("#pop span").html("请提交图片");
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(image);

      data.append("bName", bname);
      data.append("price", price);
      data.append("major", major);
      data.append("grade", grade);
      data.append("more", describe);
      data.append("photo", image[0]);
      data.append("newold", old);

      console.log(data)

     //验证提交的表单是否为空
     if (bname == ""||price == ""||major == ""|| describe == "") {
       $("#pop").show();
       $("#pop span").html("请填写完整");
     } else {
       //提交
        $.ajax({
          type: "POST",
          url: "/book/publish",
          processData: false,
          contentType: false,
          xhrFields: {withCredentials: true},
          data : data,
          success: function (data) {
            confirm("上传成功！");
          },
          error (XMLHttpRequest, textStatus, errorThrown) {
            confirm("上传失败！")
            console.log(XMLHttpRequest)
            console.log(textStatus)
            console.log(errorThrown)
          }
        })
      }    
    }   
  })
});