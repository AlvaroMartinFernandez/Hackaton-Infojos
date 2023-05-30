# Hackaton-Infojos

Esta seria un APi para Backend en Node.JS y express.(Anticipadamente pido disculpas no tuve tiempo ha hacer el front pero me parece un proyecto interesante)

FUNCIONALIDAD:

1-Busqueda ofertas filtradas por provincia donde vive el solicitante y las subcategorias preferidas (inicialmente queria añadirse tambien las opciones de solo teletrabajo,
pero la API no devuelve dicho campo se tiene que notificar a ingojobs).

   Mediante solicitudes a la API de Infojobs solicitaremos la siguiente informacion del perfil:
      - Mi codigo de CV.
      - Mi datos academicos.
      - Mi experecia Laboral.
      - Habilidades tecnicas
      - Mis preferencias laborales
     Toda esta informacion la utilizaremos para realizar una seleccion de las ofertas en el lugar que se reside y con las categorias preferidas.
     ![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/62dd59c8-2314-4cc7-ab8f-0801799f5766)
![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/8c8431e9-ce31-4973-94e9-4b9c6d23e625)
![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/4bf52e30-e223-4690-84b7-c177c37eff91)
![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/513adf0c-b772-4310-b6d1-4916887caf4d)
![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/29554d29-110b-43dc-b380-c82bda8e4a1f)

     
2-Filtrado de las 2 ofertas mas compatibles con tu perfil segun chat gpt:
  
    Para evitar el uso innecesario de recursos en al api en estado inicial hemos mandado solo 5 ofertas a chat gpt y mediante la informacion de nuestro perfil basada en la experencia los datos academicos
    y las habilidades tecnicas le hemos indicado que elija las 2 ofertas mas compatibles con nuestro perfil.
    ![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/e4e62499-d7c5-4a3c-b72b-6c19ad793ff8)


3- Se procedera a incribirse en la ofertas preseleccionadas de manera autonoma
    Mediante chat gpt responderemos a las preguntas en funcion de nuestro perfil en caso de que las haya y procederemos a incribir la oferta tal y como vemos en las imagenes.
    ![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/8bc9b37d-d639-47ea-b80e-b226d72a982b)
    ![image](https://github.com/AlvaroMartinFernandez/Hackaton-Infojos/assets/91843474/c4bfb249-e401-49fd-9236-ce6db92880e1)
