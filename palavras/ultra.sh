dir=$HOME/SofrenciaBot/palavras;
#file=palavras.json
#animal pais time comida natureza obj roupa
#bebida veiculo movel nome prof corpo lugar ind
palAnimal=`cat $dir/animal.txt | tr [' '] [',']`;
palPais=`cat $dir/pais.txt | tr [' '] [',']`;
palFut=`cat $dir/futebol.txt | tr [' '] [',']`;
palComida=`cat $dir/comida.txt | tr [' '] [',']`;
palNatureza=`cat $dir/natureza.txt | tr [' '] [',']`;
palObjeto=`cat $dir/objeto.txt | tr [' '] [',']`;
palRoupa=`cat $dir/roupa.txt | tr [' '] [',']`;
palFruta=`cat $dir/fruta.txt | tr [' '] [',']`;
palBebida=`cat $dir/bebida.txt | tr [' '] [',']`;
palVeiculo=`cat $dir/veiculo.txt | tr [' '] [',']`;
palNome=`cat $dir/nome.txt | tr [' '] [',']`;
palProf=`cat $dir/profissao.txt | tr [' '] [',']`;
palCorpo=`cat $dir/corpo.txt | tr [' '] [',']`;
palLugar=`cat $dir/lugar.txt | tr [' '] [',']`;
palInd=`cat $dir/ind.txt | tr [' '] [',']`;

dir=$HOME/SofrenciaBot/files
ultra=ultra.json
echo '{' > $dir/$ultra
echo '  "palavras":"'"$palInd,$palNome,$palProf,$palPais,$palFut,$palAnimal,$palCorpo,$palLugar,$palFruta,$palRoupa,$palObjeto,$palComida,$palBebida,$palVeiculo,$palNatureza"'",' >> $dir/$ultra
echo '  "ind":"'$palInd'",' >> $dir/$ultra
echo '  "Nome":"'$palNome'",' >> $dir/$ultra
echo '  "Profissão":"'$palProf'",' >> $dir/$ultra
echo '  "País":"'$palPais'",' >> $dir/$ultra
echo '  "Futebol":"'$palFut'",' >> $dir/$ultra
echo '  "Animal":"'$palAnimal'",' >> $dir/$ultra
echo '  "Parte-do-corpo":"'$palCorpo'",' >> $dir/$ultra
echo '  "Lugar":"'$palLugar'",' >> $dir/$ultra
echo '  "Fruta":"'$palFruta'",' >> $dir/$ultra
echo '  "Roupa":"'$palRoupa'",' >> $dir/$ultra
echo '  "Objeto":"'$palObjeto'",' >> $dir/$ultra
echo '  "Comida":"'$palComida'",' >> $dir/$ultra
echo '  "Bebida":"'$palBebida'",' >> $dir/$ultra
echo '  "Veículo":"'$palVeiculo'",' >> $dir/$ultra
echo '  "Natureza":"'$palNatureza'"' >> $dir/$ultra
echo '}' >> $dir/$ultra
