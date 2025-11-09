import React, { useState } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import { CheckCircle2, XCircle } from 'lucide-react';

const VerifyDocument = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [documentCode, setDocumentCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.get(`/certificates/verificar/${documentCode}`);
      const data = response.data?.data || response.data;
      setResult({
        success: true,
        data: data
      });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Documento não encontrado ou código inválido.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDocumentCode('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Verificação de Autenticidade de Documentos
        </h1>
        
        {!result ? (
          <>
            <p className="text-sm text-neutral-600 mb-6">
              Utilize esta ferramenta para verificar a autenticidade de documentos acadêmicos emitidos pela instituição.
              Insira o código de verificação presente no documento para confirmar sua validade.
            </p>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                label="Código de Verificação"
                name="documentCode"
                placeholder="Ex: ABC123XYZ"
                value={documentCode}
                onChange={(e) => setDocumentCode(e.target.value)}
                required
              />
              
              <Button disabled={loading} className="w-full" type="submit">
                {loading ? 'Verificando...' : 'Verificar Documento'}
              </Button>
            </form>
          </>
        ) : loading ? (
          <Loading text="Verificando documento..." />
        ) : result.success ? (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-2">Documento Autêntico!</h2>
            <p className="text-sm text-neutral-600 mb-6">
              Este documento foi emitido oficialmente pela instituição e é válido.
            </p>
            
            <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-neutral-900 mb-3">Detalhes do Documento:</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong className="text-neutral-700">Tipo:</strong>{' '}
                  <span className="text-neutral-600">
                    {result.data.type === 'matricula' ? 'Declaração de Matrícula' : 
                     result.data.type === 'conclusao' ? 'Certificado de Conclusão' : 
                     result.data.type === 'historico' ? 'Histórico Escolar' : 
                     result.data.type === 'declaracao' ? 'Declaração de Vínculo' :
                     result.data.type === 'outro' ? 'Outro' :
                     result.data.type}
                  </span>
                </p>
                <p>
                  <strong className="text-neutral-700">Título:</strong>{' '}
                  <span className="text-neutral-600">{result.data.title}</span>
                </p>
                <p>
                  <strong className="text-neutral-700">Emitido em:</strong>{' '}
                  <span className="text-neutral-600">
                    {new Date(result.data.issueDate).toLocaleDateString('pt-BR')}
                  </span>
                </p>
                {result.data.expiryDate && (
                  <p>
                    <strong className="text-neutral-700">Válido até:</strong>{' '}
                    <span className="text-neutral-600">
                      {new Date(result.data.expiryDate).toLocaleDateString('pt-BR')}
                    </span>
                  </p>
                )}
              </div>
            </div>
            
            <Button onClick={resetForm} className="w-full">
              Verificar Outro Documento
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Documento Não Verificado</h2>
            <p className="text-sm text-neutral-600 mb-6">{result.message}</p>
            <Button onClick={resetForm} className="w-full">
              Tentar Novamente
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerifyDocument;
