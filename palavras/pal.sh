#!/bin/sh

DIR=$HOME/SofrenciaBot/files;
fonte=$DIR/ultra.json;
result=$DIR/test.json;
pos='":"'
palPais=`cat $fonte | grep '"pais"' | cut -f2 -d':' | tr -d ['"']`;
palAnimal=`cat $fonte | grep '"animal"' | cut -f2 -d':' | tr -d ['"']`;
palComida=`cat $fonte | grep '"comida"' | cut -f2 -d':' | tr -d ['"']`;

while [ true ]; do
  echo '- Temas disponíveis:'
  echo 'pais, animal, comida'
  echo ''
  echo ''
  echo '\n- Digite tema e palavra:'
  read value;
  tema=`echo $value | cut -f1 -d' '`
  palavra=`echo $value | cut -f2 -d' '`

  #Confere se a palavra fornecida já está no tema
  #fornecido
  repeated=`cat $fonte | grep $tema | grep ,$palavra, >> /dev/null`

  #Se a palavra já está no arquivo
  if [ "$repeated" ]; then
    echo '\n- Essa palavra já está no arquivo';
    exit;
  fi;

  if [ ! "$tema" ]; then
    echo '- Deseja encerrar?';
    read resposta;
    if [ "$resposta" = 'sim' ]; then
      echo '{' > $result;
      echo '  "pais":"'$palPais'",' >> $result;
      echo '  "animal":"'$palAnimal'",' >> $result;
      echo '  "comida":"'$palComida'"' >> $result;
      echo '}' >> $result;
      clear;
      echo '- Arquivo atualizado';
      exit
    fi;
  else
    case $tema in

    pais)
      palPais=$palPais,$palavra
      echo "A palavra $palavra foi guardada.";;

    animal)
      palAnimal=$palAnimal,$palavra;;

    comida)
      palComida=$palComida,$palavra;;
    esac
  fi;
done;

