#!/bin/sh

dir=$HOME/SofrenciaBot/palavras.json;
run=true;
pos='":"'
palPais=`cat $dir | grep '"pais"' | cut -f2 -d':' | tr -d ['"']`;
palAnimal=`cat $dir | grep '"animal"' | cut -f2 -d':' | tr -d ['"']`;
palComida=`cat $dir | grep '"comida"' | cut -f2 -d':' | tr -d ['"']`;

while [ $run = true ]; do
  echo '\n- Digite tema e palavra:'
  read value;
  tema=`echo $value | cut -f1 -d' '`
  palavra=`echo $value | cut -f2 -d' '`

  if [ ! "$tema" -o ! "$palavra"]; then
    echo '\n- '
  fi;

  #Confere se a palavra fornecida já está no tema
  #fornecido
  repeated=`cat $dir | grep $tema | grep $palavra`

  #Se a palavra já está no arquivo
  if [ "$repeated" ]; then
    echo '\n- Essa palavra já está no arquivo';
  else
    #Se a palavra não estiver no arquivo

    #Se 
    if [ ! "$palavra" ]; then
      echo '- Deseja encerrar?';
      read resposta;
      if [ "$resposta" = 'sim' ]; then
        echo '{' > $dir;
        echo '  "pais":"'$palPais'",' >> $dir;
        echo '  "animal":"'$palAnimal'",' >> $dir;
        echo '  "comida":"'$palComida'"' >> $dir;
        echo '}' >> $dir;
        clear;
        echo '- Arquivo atualizado';
        echo '* Corrija as vírgulas no arquivo';
        run=false;
      fi;
    else
      case $tema in
      pais)
      palPais=$palPais,$palavra;;

      animal)
      palAnimal=$palAnimal,$palavra;;

      comida)
      palComida=$palComida,$palavra;;
      esac
    fi;
  fi;
done;

