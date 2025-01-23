// app/api/submit-form/route.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(request: Request) {
  try {
    // Obtenemos los datos del formulario
    const formData = await request.json();

    // Validamos los datos requeridos
    if (!formData.concept || !formData.firstName || !formData.lastName) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Creamos el registro en Airtable
    const records = await base('Formularios').create([
      {
        fields: {
          Concepto: formData.concept,
          Valor: parseFloat(formData.value) || 0,
          Telefono: formData.phone,
          Cedula: formData.idNumber,
          NumeroCuenta: formData.accountNumber,
          Banco: formData.bank,
          TipoCuenta: formData.accountType,
          Ciudad: formData.city,
          Departamento: formData.department,
          Nombres: formData.firstName,
          Apellidos: formData.lastName,
          Items: formData.collectionItems,
          Firma: formData.signature,
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Datos guardados correctamente',
      recordId: records[0].id
    });

  } catch (error) {
    console.error('Error al guardar en Airtable:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al guardar en Airtable',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}