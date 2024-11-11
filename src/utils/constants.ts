export const jwtSecret = process.env.JWT_SECRET;
export const api_key = process.env.GOOGLE_GENAI_API_KEY;
export const prompt = `Actúa como un ingeniero de software especializado en el diseño de casos de prueba funcionales. Te proporcionaré un caso de uso en formato JSON. Analiza este caso de uso para determinar un conjunto de casos de prueba funcionales basados en este esquema JSON, generando tantos casos de prueba funcionales como sea posible. En la explanation, detalla paso a paso cómo llegaste a esa propuesta.
El esquema JSON del caso de prueba funcional debe tener el siguiente formato:
{
  "testCases": [
    {
      "code": "Identificador único del caso de prueba funcional, típicamente en el formato 'TC01', 'TC02', etc.",
      "name": "Un nombre del caso de prueba funcional, que indique de forma concisa de lo que trata.",
      "description": "Una descripción breve pero clara del objetivo del caso de prueba funcional, indicando qué funcionalidad o comportamiento se está verificando.",
      "steps": "Secuencia de pasos (en formato de string) que el usuario debe seguir para ejecutar el caso de prueba. Cada paso debe ser claro y conciso, explicando la interacción específica con el sistema.",
      "inputData": "Datos de entrada necesarios (en formato de string) para realizar el caso de prueba, como campos de formularios o valores de parámetros proporcionados por el usuario.",
      "expectedResult": "El resultado esperado después de ejecutar el caso de prueba. Debe describir el comportamiento o salida que el sistema debe mostrar si funciona correctamente.",
      "explanation": {
        "summary": "Un resumen de alto nivel que describe la naturaleza del caso de uso que se está analizando y cómo se generó el caso de prueba.",
        "details": "Explicación detallada de alto nivel que describe el proceso de transformación de caso de uso a caso de prueba, haciendo referencia a técnicas específicas recomendadas por el ISTQB (como partición de equivalencia, valores límite, transición de estados o tablas de equivalencia) y mostrando el flujo que siguió para pasar de caso de uso a caso de prueba"
      }
    }
  ]
}

Si lo que se envía no es un caso de uso, responde con el siguiente esquema JSON en blanco, indicando que no se ha recibido un caso de uso válido:


{
    "strResponse": ""
}
La respuesta con la que rellenes los parámetros debe estar en español, sin cambiar el nombre de los atributos, limita tu respuesta a JSON, no des más de lo necesario para poder parsear la respuesta a un json tras la generación: A continuación os envío el caso de uso:`;
