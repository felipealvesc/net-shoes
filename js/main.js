showJson();


function showJson(){
	var endereco = 'http://localhost:3000/db';
	$.ajax({
		url: endereco,
		complete: function(res){
			var meuJSON = JSON.parse(res.responseText);
			varomodifier = meuJSON.products.map(function(shelfItem){
				var _ = shelfItem;
				_.valorParcela = _.price % _.installments;
				return shelfItem;
			});
			meuJSON.calc = function () {
				return function(price, render) {
					var arrStr = render(price).split('%%%');
					var roundedVal = 'R$ ' + (arrStr[0]/arrStr[1]).toFixed(2).replace('.',',');
					return roundedVal;
				};
			}
			var template=document.querySelector("#template").innerHTML;
			t=Mustache.render(template, meuJSON);
			document.querySelector(".shelf-content").innerHTML=t;
			$(".comprar").click(addCart);

		}
	});
}
var addCart = function(event) {

	event.preventDefault();
	var carrinho = $(".carrinho");
	$(carrinho).addClass('cart-fixed');
	var closeCarrinho = $(".close-cart");
	$(closeCarrinho).addClass('close-fixed');
	var skuId = $(this).data("sku-id");
	var $shelfItem = $($(this).closest("li"));
	var desc = $shelfItem.find(".descricao").text();
	var image = $shelfItem.find(".image").attr("src");
	var jaTemNoCarrinho = false;
	sessionStorage.setItem("desc",desc.value);

	for (var i = 0; i < cartObject.carrinho.length; i++) {
		var itemCarrinho = cartObject.carrinho[i];

		if (itemCarrinho.skuId === skuId) {
			jaTemNoCarrinho = true;
			itemCarrinho.qtde = itemCarrinho.qtde + 1;
		}
	}
	if (!jaTemNoCarrinho) {
		cartObject.carrinho.push({
			"skuId": skuId,
			"descricao": desc,
			"qtde": 1,
			"image": image,
		});
	}
	var resultadoCarrinhoHTML=document.querySelector("#templateCart").innerHTML;
		tc=Mustache.render(resultadoCarrinhoHTML, cartObject);
		document.querySelector(".carrinho").innerHTML=tc;

	$(".removeItem").click(function(e){
		e.preventDefault();
		removeItem(e);
	});

	function removeItem(event) {
		for (var i = cartObject.carrinho.length - 1; i >= 0; i--) {
			if(cartObject.carrinho[i].skuId == $(event.currentTarget).closest("li").attr('id')) {
				$(event.currentTarget).closest("li").remove();
				cartObject.carrinho.splice(i,1);
				break;
			}
		}
	}
}

$(".close-cart").click(function(event){
	event.preventDefault();
	$('.carrinho').removeClass('cart-fixed');
	$('.close-cart').removeClass('close-fixed');

});
$(".open-cart").click(function(event){
	event.preventDefault();
	var carrinho = $(".carrinho");
	$(carrinho).addClass('cart-fixed');
	var closeCarrinho = $(".close-cart");
	$(closeCarrinho).addClass('close-fixed');
	

});
var cartObject = {"carrinho": []};

// var shelfItens = $(".shelf-itens");
// var descricao = $(".descricao");


// var li = document.createElement("li");
// var span = document.createElement("span");

// li.textContent = shelfItens;
// span.textContent = descricao.text();

// ul.appendChild(li);
// li.appendChild(span);
		
// 		console.log(ul);
