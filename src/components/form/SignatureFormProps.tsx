'use client';

import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import styles from './SignatureForm.module.css';

// Definición de tipos para nuestro formulario
interface CollectionItem {
  description: string;
  value: number;
}

interface FormData {
  concept: string;
  value: number;
  phone: string;
  idNumber: string;
  accountNumber: string;
  bank: string;
  accountType: 'savings' | 'checking';
  city: string;
  department: string;
  firstName: string;
  lastName: string;
  collectionItems: CollectionItem[];
  attachedFile?: File;
  signature: string;
}

// Estado inicial del formulario para reutilizarlo
const initialFormState: FormData = {
  concept: '',
  value: 0,
  phone: '',
  idNumber: '',
  accountNumber: '',
  bank: '',
  accountType: 'savings',
  city: '',
  department: '',
  firstName: '',
  lastName: '',
  collectionItems: [],
  signature: ''
};

export default function SignatureForm() {
  // Estados del formulario
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [currentItem, setCurrentItem] = useState<CollectionItem>({
    description: '',
    value: 0
  });
  
  // Estados para manejar el envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Referencias
  const signaturePadRef = useRef<SignaturePad>(null);

  // Manejadores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    if (currentItem.description && currentItem.value > 0) {
      setFormData(prev => ({
        ...prev,
        collectionItems: [...prev.collectionItems, currentItem]
      }));
      setCurrentItem({ description: '', value: 0 });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachedFile: file
      }));
    }
  };

  const clearSignature = () => {
    signaturePadRef.current?.clear();
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData(initialFormState);
    clearSignature();
    setCurrentItem({ description: '', value: 0 });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signaturePadRef.current?.isEmpty()) {
      setSubmitError('Por favor, añade tu firma');
      return;
    }
  
    setIsSubmitting(true);
    setSubmitError(null);
  
    try {
      const signatureData = signaturePadRef.current?.toDataURL();
      
      // En lugar de usar FormData, vamos a enviar un objeto JSON
      const formDataToSend = {
        ...formData,
        signature: signatureData || '',
        // Convertimos el array de items a string si existe
        collectionItems: JSON.stringify(formData.collectionItems),
        // No incluimos el archivo adjunto por ahora, lo manejaremos después
      };
  
      // Enviamos a nuestra API local
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el formulario');
      }
  
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        resetForm();
      } else {
        throw new Error('Error al procesar el formulario');
      }
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al enviar el formulario');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clase base común para inputs y selects
  const inputBaseClass = "mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Mensaje de éxito */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Formulario enviado con éxito
        </div>
      )}

      {/* Mensaje de error */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda - Información principal */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-200">Concepto</span>
              <input
                type="text"
                name="concept"
                value={formData.concept}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Valor</span>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Teléfono</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Cédula</span>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Número de Cuenta</span>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Banco</span>
              <input
                type="text"
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Tipo de Cuenta</span>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              >
                <option value="savings">Ahorros</option>
                <option value="checking">Corriente</option>
              </select>
            </label>
          </div>

          {/* Columna derecha - Información adicional y firma */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-200">Ciudad</span>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Departamento</span>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Nombres</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="text-gray-200">Apellidos</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={inputBaseClass}
                required
                disabled={isSubmitting}
              />
            </label>

            {/* Sección de Items */}
            <div className="border border-gray-700 p-4 rounded-lg bg-gray-800">
              <h3 className="font-semibold mb-2 text-gray-200">Items de la cuenta de cobro</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={currentItem.description}
                  onChange={e => setCurrentItem(prev => ({...prev, description: e.target.value}))}
                  className={inputBaseClass}
                  disabled={isSubmitting}
                />
                <input
                  type="number"
                  placeholder="Valor"
                  value={currentItem.value}
                  onChange={e => setCurrentItem(prev => ({...prev, value: Number(e.target.value)}))}
                  className={inputBaseClass}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-500"
                  disabled={isSubmitting}
                >
                  Agregar Item
                </button>
              </div>
              <div className="mt-4">
                {formData.collectionItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 text-gray-200">
                    <span>{item.description}</span>
                    <span>${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de archivo adjunto */}
            <div className="border border-gray-700 p-4 rounded-lg bg-gray-800">
              <h3 className="font-semibold mb-2 text-gray-200">Archivo Adjunto</h3>
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="block w-full text-gray-200
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-500 file:text-white
                  hover:file:bg-blue-600
                  cursor-pointer
                  disabled:opacity-50"
              />
            </div>

            {/* Sección de firma */}
            <div className="border border-gray-700 p-4 rounded-lg bg-gray-800">
              <h3 className="font-semibold mb-2 text-gray-200">Firma Digital</h3>
              <div className="border border-gray-600 rounded-lg overflow-hidden bg-white">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: styles.signaturePad
                  }}
                />
              </div>
              <button
                type="button"
                onClick={clearSignature}
                disabled={isSubmitting}
                className="mt-2 text-sm text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                Limpiar firma
              </button>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded transition-colors ${
              isSubmitting 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
          </button>
        </div>
      </form>
    </div>
  );
}