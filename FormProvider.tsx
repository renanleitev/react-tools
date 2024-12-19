// Bibliotecas para validar os formulários
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type UseFormReturn } from "react-hook-form";

// Para cada formulário, criar uma opção no enum
export enum CadastroSchemaOption {
  DADOS_CADASTRAIS = "DADOS_CADASTRAIS",
  DADOS_ESTABELECIMENTO = "DADOS_ESTABELECIMENTO",
  DADOS_ENDERECO = "ENDERECO",
  DADOS_PROPRIETARIO = "PROPRIETARIO",
  DADOS_BANCARIOS = "DADOS_BANCARIOS",
  CONDICOES_COMERCIAIS = "CONDICOES_COMERCIAIS",
  DADOS_MAQUINA = "DADOS_MAQUINA",
}

// Pessoa Física ou Jurídica
type DadosCadastraisType = {
  natureza: string; // TODO: Substituir por enum
  nome: string; // Nome ou Razão Social
  CPF?: string;
  CNPJ?: string;
  dataAbertura: string;
};

type DadosEstabelecimentoType = {
  nomeFantasia: string;
  ramo: string;
  segmento: string;
  faturamento: string;
};

type DadosEnderecoType = {
  CEP: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  UF: string;
};

type DadosProprietarioType = {
  nome: string;
  CPF?: string;
  CNPJ?: string;
  RG?: string;
  telefonePrimario: string;
  telefoneSecundario?: string;
  email: string;
};

type DadosBancariosType = {
  bancoNome: string;
  bancoCod: string;
  bancoTipoConta: string;
  bancoAgencia: string;
  bancoConta: string;
  bancoTipoPIX: string; // TODO: Substituir por enum
  bancoChavePIX: string;
};

type CondicoesComerciaisType = {
  tabelaVenda: string;
  tabelaObservacoes: string;
};

type DadosMaquinaType = {
  maquinaTipo: string; // TODO: Substituir por enum
  maquinaModalidade: string;
  maquinaValor: string;
  maquinaSerial: string;
  maquinaObservacoes: string;
};

// TODO: Checar se é necessário utilizar optional e Partial em todas as propriedades
export type CadastroFormData = {
  dadosCadastrais?: Partial<DadosCadastraisType>;
  dadosEstabelecimento?: Partial<DadosEstabelecimentoType>;
  dadosEndereco?: Partial<DadosEnderecoType>;
  dadosProprietario?: Partial<DadosProprietarioType>;
  dadosBancarios?: Partial<DadosBancariosType>;
  condicoesComerciais?: Partial<CondicoesComerciaisType>;
  dadosMaquina?: Partial<DadosMaquinaType>;
};

type CadastroFormContextType = {
  cadastroForm?: UseFormReturn<CadastroFormData>;
  schemaOption: CadastroSchemaOption;
  seSchemaOption: (schemaOption: CadastroSchemaOption) => void;
};

const CadastroFormContext = createContext<CadastroFormContextType>({
  cadastroForm: undefined,
  schemaOption: CadastroSchemaOption.DADOS_CADASTRAIS,
  setSchemaOption: () => {},
});

export const CadastroFormProvider = ({ children }: { children: ReactNode }) => {
  const [schemaOption, setSchemaOption] = useState<CadastroSchemaOption>(
    CadastroSchemaOption.DADOS_CADASTRAIS
  );

  const dadosCadastraisSchema = yup.object<CadastroFormData>().shape({
    dadosCadastrais: yup.object<DadosCadastraisType>().shape({
      natureza: yup.string().required("Natureza é obrigatório"),
      // Fazer isso para todos as propriedades
    }),
  });

  const dadosEstabelecimentoSchema = yup.object<CadastroFormData>().shape({
    dadosCadastrais: yup.object<DadosCadastraisType>().shape({
      nomeFantasia: yup.string().required("Nome fantasia é obrigatório"),
      // Fazer isso para todos as propriedades
    }),
  });

  // Criar schemas para cada etapa do formulário

  const schemaTranslation = {
    [CadastroSchemaOption.DADOS_CADASTRAIS]: dadosCadastraisSchema,
    [CadastroSchemaOption.DADOS_ESTABELECIMENTO]: dadosEstabelecimentoSchema,
    // Fazer isso para todos os schemas
  };

  const defaultValues: CadastroFormData = {
    dadosCadastrais: {
      CPF: "",
      CNPJ: "",
      nome: "",
      natureza: "",
      dataAbertura: "",
    },
    // Fazer isso para todas as etapas
  };

  const cadastroForm = useForm<CadastroFormData>({
    resolver: yupResolver(schemaTranslation[schemaOption]),
    defaultValues,
    mode: "onTouched",
  });

  return (
    <CadastroFormContext.Provider
      value={{
        cadastroForm,
        schemaOption,
        setSchemaOption,
      }}
    >
      {children}
    </CadastroFormContext.Provider>
  );
};

export const useCadastroForm = () => {
  const { cadastroForm, schemaOption, setSchemaOption } =
    useContext(CadastroFormContext);

  return { cadastroForm, schemaOption, setSchemaOption };
};
