dir=$HOME/SofrenciaBot/palavras;
palavras=`cat $dir/palavras.txt | tr [','] [' ']`;
array=($palavras);

palAnimal=`cat $dir/animal.txt`;
palPais=`cat $dir/pais.txt`;
palFut=`cat $dir/futebol.txt`;
palComida=`cat $dir/comida.txt`;
palNatureza=`cat $dir/natureza.txt`;
palObjeto=`cat $dir/objeto.txt`;
palFruta=`cat $dir/fruta.txt`;
palRoupa=`cat $dir/roupa.txt`;
palBebida=`cat $dir/bebida.txt`;
palVeiculo=`cat $dir/veiculo.txt`;
palNome=`cat $dir/nome.txt`;
palProf=`cat $dir/profissao.txt`;
palCorpo=`cat $dir/corpo.txt`;
palLugar=`cat $dir/lugar.txt`;
palInd=`cat $dir/ind.txt`;

save(){
  echo `echo ${array[*]} | tr [' '] [',']` > $dir/palavras.txt
  echo $palAnimal > $dir/animal.txt;
  echo $palPais > $dir/pais.txt;
  echo $palFut > $dir/futebol.txt;
  echo $palBebida > $dir/bebida.txt;
  echo $palFruta > $dir/fruta.txt;
  echo $palRoupa > $dir/roupa.txt;
  echo $palComida > $dir/comida.txt;
  echo $palNatureza > $dir/natureza.txt;
  echo $palNome > $dir/nome.txt;
  echo $palObjeto > $dir/objeto.txt;
  echo $palVeiculo > $dir/veiculo.txt;
  echo $palProf > $dir/profissao.txt;
  echo $palCorpo > $dir/corpo.txt;
  echo $palLugar > $dir/lugar.txt;
  echo $palInd > $dir/ind.txt;
}

close(){
  save;
  bash ultra.sh;
  exit;
}

clear

until [ 1 != 1 ]; do
  length=${#array[*]}
  if [ $length -gt 0 ]; then
    ult=$[ $length - 1 ]
    palavra=${array[$ult]}
    while [ "`cat palavras.json | grep $palavra`" ]; do
      echo "- Palavra repetida! --> $palavra"
      unset array[$ult];
      length=${#array[*]}
      if [ $length -gt 0 ]; then
        ult=$[ $length - 1 ]
        palavra=${array[$ult]}
        else
         clear;
         echo Acabaram as palavras
         close;
      fi
    done
    else
     clear;
     echo Acabaram as palavras
     close;
  fi
  echo Restam $[$length - 1] palavras
  echo -e "\nA palavra é: "'"'$palavra'"'
  echo A qual tema ela pertence?
  echo ""
# echo animal  pais   comida   lugar
# echo prof   'time'  natureza obj
#  echo veiculo bebida corpo
  read tema
  case $tema in

  animal)
   palAnimal=$palAninal' '$palavra;;

  comida)
   palComid=$palComida' '$palavra;;

  fut)
   palTime=$palFut' '$palavra;;

  pais)
   palPais=$palPais' '$palavra;;

  obj)
   palObjeto=$palObjeto' '$palavra;;

  bebida)
   palBebida=$palBebida' '$palavra;;

  fruta)
   palFruta=$palFruta' '$palavra;;

  roupa)
   palRoupa=$palRoupa' '$palavra;;

  prof)
   palProf=$palProf' '$palavra;;

  corpo)
   palCorpo=$palCorpo' '$palavra;;

  veiculo)
   palVeiculo=$palVeiculo' '$palavra;;

  nome)
   palNome=$palNome' '$palavra;;

  natureza)
   palNatureza=$palNatureza' '$palavra;;

  fim)
   clear;
   close;;

  '')
   clear;;

  lugar)
   palLugar=$palLugar' '$palavra;;

  *)
   palInd=$palInd' '$palavra;
    clear;;

  *)
   echo O tema '"'$tema'"' precisa ser criado.
   touch $tema.txt
   close;;
  esac
  ult=$[ $length - 1 ]
  unset array[$ult];
done;
