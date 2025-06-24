document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis e Seletores do Sistema de Criação de Personagem (Original 1º Código) ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const characterCreationMenu = document.getElementById('character-creation-menu');
    const raceSelectionScreen = document.getElementById('race-selection-screen');
    const statusScreen = document.getElementById('status-screen'); // Este será o statusView

    const openMenuButton = document.getElementById('open-menu-button');
    const characterNameInput = document.getElementById('character-name');
    const nextToRaceButton = document.getElementById('next-to-race-button');
    const raceButtons = document.querySelectorAll('.race-button');
    const attributeChoiceDiv = document.getElementById('attribute-choice');
    const rollDiceButton = document.getElementById('roll-dice-button');
    const manualAttributesButton = document.getElementById('manual-attributes-button');
    const rolledAttributesDiv = document.getElementById('rolled-attributes');
    const nextToStatusButton = document.getElementById('next-to-status-button');

    const displayName = document.getElementById('display-name');
    const displayRace = document.getElementById('display-race');
    const displayForca = document.getElementById('display-forca');
    const displayVigor = document.getElementById('display-vigor');
    const displayAgilidade = document.getElementById('display-agilidade');
    const displayInteligencia = document.getElementById('display-inteligencia');
    const displaySabedoria = document.getElementById('display-sabedoria');
    const displaySorte = document.getElementById('display-sorte');
    const displayCarisma = document.getElementById('display-carisma');
    const displayTamanho = document.getElementById('display-tamanho');
    const displayAparencia = document.getElementById('display-aparencia');

    let currentCharacter = {
        name: '',
        race: '',
        attributes: {}
    };

    // --- Variáveis e Seletores do Sistema de Perícias (Original 2º Código) ---
    const periciasLista = [
        "Charme", "Intimidação", "Lábia", "Acalmar",
        "Artes", "Ciências", "Investigação", "Alquimia", "Engenharia",
        "Percepção", "Raciocínio", "Medicina", "Sobrevivência",
        "Fortitude", "Mergulho", "Vontade",
        "Escalar", "Lutar (varia)", "Operação", "Furtividade", "Pontaria",
        "Crime", "Natação", "Saltar", "Prestidigitação", "Pilotagem",
        "Intuição", "Encontrar", "Adestrar"
    ];

    const togglePerfisBtn = document.getElementById('togglePerfisBtn');
    const configPerfisWrapper = document.getElementById('configPerfisWrapper');
    const mensagemPerfil = document.getElementById('mensagemPerfil');

    const salvarPerfil1Btn = document.getElementById('salvarPerfil1');
    const carregarPerfil1Btn = document.getElementById('carregarPerfil1');
    const salvarPerfil2Btn = document.getElementById('salvarPerfil2');
    const carregarPerfil2Btn = document.getElementById('carregarPerfil2');
    const salvarPerfil3Btn = document.getElementById('salvarPerfil3');
    const carregarPerfil3Btn = document.getElementById('carregarPerfil3');

    const mainFloatingBtn = document.getElementById('mainFloatingBtn');
    const floatingNav = document.querySelector('.floating-nav');
    const showPericiasBtn = document.getElementById('showPericiasBtn');
    const showStatusBtn = document.getElementById('showStatusBtn');

    const appContentArea = document.getElementById('app-content-area');

    let periciasView;
    let statusView; // Já temos statusScreen do primeiro código, vamos usá-lo como statusView
    let searchInput;
    let periciasContainer;
    let resetarBtn;

    // --- FUNÇÕES COMPARTILHADAS/UTILITY ---

    /**
     * Função para rolar dados (do primeiro código).
     */
    function rollDice(diceString) {
        let total = 0;
        const parts = diceString.split('+');
        const dicePart = parts[0];
        const numDice = parseInt(dicePart.split('D')[0]);
        const dieType = parseInt(dicePart.split('D')[1]);

        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieType) + 1;
        }

        if (parts.length > 1) {
            total += parseInt(parts[1]);
        }
        return total;
    }

    // Definições de atributos por raça (do primeiro código).
    const raceAttributes = {
        "Humano": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "3D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "3D6",
            "Carisma": "3D6", "Tamanho": "2D6+6", "Aparência": "3D6"
        },
        "Villager": {
            "Força": "2D6", "Vigor": "3D6", "Agilidade": "3D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "3D6",
            "Carisma": "3D6+6", "Tamanho": "2D6+6", "Aparência": "2D6"
        },
        "Anão": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "2D6",
            "Inteligência": "2D6+12", "Sabedoria": "0", "Sorte": "3D6",
            "Carisma": "3D6", "Tamanho": "2D4+3", "Aparência": "3D6"
        },
        "Elfo": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "4D6",
            "Inteligência": "2D6+6", "Sabedoria": "1D4", "Sorte": "3D6",
            "Carisma": "2D6", "Tamanho": "2D6+6", "Aparência": "2D6"
        },
        "Fada": {
            "Força": "2D6", "Vigor": "2D6", "Agilidade": "4D6",
            "Inteligência": "2D6+6", "Sabedoria": "1D6+4", "Sorte": "3D6",
            "Carisma": "3D6", "Tamanho": "2D6+1", "Aparência": "3D6"
        },
        "Golem": {
            "Força": "4D6", "Vigor": "4D6", "Agilidade": "3D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "2D6",
            "Carisma": "3D6", "Tamanho": "4D6", "Aparência": "3D6"
        },
        "Gnomo": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "4D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "3D6+6",
            "Carisma": "3D6", "Tamanho": "2D4+1", "Aparência": "3D6"
        },
        "Sereia": {
            "Força": "3D6", "Vigor": "4D6", "Agilidade": "3D6",
            "Inteligência": "2D6", "Sabedoria": "0", "Sorte": "2D6",
            "Carisma": "4D6", "Tamanho": "2D6+6", "Aparência": "3D6"
        }
    };

    /**
     * Exibe uma seção específica e oculta as outras.
     * Integrado do segundo código, mas adaptado para as telas existentes.
     * @param {HTMLElement} screenToShow O elemento da tela a ser exibida.
     */
    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none'; // Garante que estejam ocultas
        });
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active-view');
            section.style.display = 'none'; // Garante que estejam ocultas
        });

        // Adiciona a classe ativa e define o display
        screenToShow.classList.add('active');
        screenToShow.style.display = 'flex'; // Mantém como 'flex' para as telas que usam flexbox

        // A tela de criação de personagem tem um comportamento de modal que precisa de sua própria classe 'open'
        // para a transição de posição.
        if (screenToShow.id === 'character-creation-menu') {
            screenToShow.classList.add('open');
        } else {
            characterCreationMenu.classList.remove('open');
        }

        floatingNav.classList.remove('active'); // Fecha o menu flutuante ao navegar
    }

    /**
     * Alterna a visibilidade do painel de gerenciamento de perfis.
     * (Do segundo código)
     */
    function togglePerfisVisibility() {
        configPerfisWrapper.classList.toggle('active');
    }

    /**
     * Exibe uma mensagem temporária para o usuário.
     * (Do segundo código)
     */
    function exibirMensagem(texto, tipo = '') {
        mensagemPerfil.textContent = texto;
        mensagemPerfil.className = `mensagem-perfil ${tipo}`;
        setTimeout(() => {
            mensagemPerfil.textContent = '';
            mensagemPerfil.className = 'mensagem-perfil';
        }, 3000);
    }

    /**
     * Carrega os valores das perícias de um perfil salvo no Local Storage.
     * (Do segundo código)
     */
    function carregarPericiasDePerfil(perfilKey) {
        const savedPericias = localStorage.getItem(perfilKey);
        return savedPericias ? JSON.parse(savedPericias) : {};
    }

    /**
     * Salva os valores atuais das perícias no Local Storage para um perfil específico.
     * (Do segundo código)
     */
    function salvarPericiasEmPerfil(perfilKey) {
        const valoresParaSalvar = {};
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                valoresParaSalvar[`pericia-${index}`] = inputPericia.value;
            }
        });
        localStorage.setItem(perfilKey, JSON.stringify(valoresParaSalvar));
        exibirMensagem(`Perfil ${perfilKey.replace('perfil', '')} salvo!`, 'sucesso');
    }

    /**
     * Aplica os valores carregados de um perfil aos inputs das perícias.
     * (Do segundo código)
     */
    function aplicarPericiasCarregadas(loadedValues) {
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                inputPericia.value = loadedValues[`pericia-${index}`] || "50";
            }
        });
        filterPericias(); // Reaplicar filtro após carregar novos valores
    }

    /**
     * Salva o estado atual dos inputs de perícia no perfil 'perfilAtual'.
     * Chamado a cada mudança nos inputs. (Do segundo código)
     */
    function salvarPerfilAtual() {
        const valoresParaSalvar = {};
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                valoresParaSalvar[`pericia-${index}`] = inputPericia.value;
            }
        });
        localStorage.setItem('perfilAtual', JSON.stringify(valoresParaSalvar));
    }

    /**
     * Carrega o perfil 'perfilAtual' ao iniciar a aplicação.
     * (Do segundo código)
     */
    function carregarPerfilInicial() {
        const loadedValues = carregarPericiasDePerfil('perfilAtual');
        if (Object.keys(loadedValues).length > 0) {
            aplicarPericiasCarregadas(loadedValues);
            exibirMensagem("Valores do último uso carregados!", 'info');
        } else {
            exibirMensagem("Iniciado com valores padrão (50).", 'info');
        }
    }

    /**
     * Gera um número aleatório entre 1 e 100 (inclusive).
     * (Do segundo código)
     */
    function rolarD100() {
        return Math.floor(Math.random() * 100) + 1;
    }

    /**
     * Determina o tipo e a classe CSS do resultado da rolagem com base nas regras fornecidas.
     * (Lógica revisada para sucessos crescentes)
     */
    function determinarResultado(valorPericia, rolagem) {
        valorPericia = parseInt(valorPericia, 10);

        if (isNaN(valorPericia) || valorPericia < 1 || valorPericia > 100) {
            return { tipo: "Valor inválido (1-100)", classe: "erro-classificacao" };
        }

        // Caso de Fracasso Total (100)
        if (rolagem === 100) {
            return { tipo: "FRACASSO TOTAL!", classe: "fracasso-total" };
        }

        // Caso de Fracasso (rolagem > valor da perícia)
        if (rolagem > valorPericia) {
            return { tipo: "Fracasso!", classe: "fracasso" };
        }

        // Sucessos Extremos (1 e o valor exato da perícia)
        if (rolagem === 1 || rolagem === valorPericia) {
            return { tipo: "SUCESSO PERFEITO!", classe: "sucesso-perfeito" };
        }

        // Calcular os limites para Sucesso Ótimo, Bom e Normal (crescente)
        // Os limites são as porcentagens DO VALOR DA PERÍCIA, a rolagem deve ser MAIOR OU IGUAL a eles.
        // Para uma rolagem "mais perto do número exato da perícia" ser melhor,
        // os limites são invertidos: 18% para Ótimo (acima de 82% do valor), 30% para Bom (acima de 50% do valor), etc.

        // Sucesso Ótimo: rolagens entre (ValorPericia * 0.82) e (ValorPericia - 1)
        const limiteOtimo = Math.ceil(valorPericia * 0.82); // Ex: 100 * 0.82 = 82. Rolagens de 82 a 99 (se 100 for o valor)

        // Sucesso Bom: rolagens entre (ValorPericia * 0.50) e (limiteOtimo - 1)
        const limiteBom = Math.ceil(valorPericia * 0.50); // Ex: 100 * 0.50 = 50. Rolagens de 50 a 81

        if (rolagem >= limiteOtimo) {
            return { tipo: "Sucesso Ótimo!", classe: "sucesso-otimo" };
        } else if (rolagem >= limiteBom) {
            return { tipo: "Sucesso Bom!", classe: "sucesso-bom" };
        } else {
            // Sucesso Normal: rolagens entre 2 e (limiteBom - 1)
            return { tipo: "Sucesso Normal!", classe: "sucesso-normal" };
        }
    }


    /**
     * Filtra as perícias visíveis com base no termo de pesquisa.
     * (Do segundo código)
     */
    function filterPericias() {
        if (!searchInput || !periciasContainer) return;
        const searchTerm = searchInput.value.toLowerCase();
        const periciaItems = periciasContainer.querySelectorAll('.pericia-item');

        periciaItems.forEach(item => {
            const periciaNome = item.dataset.periciaNome;
            if (periciaNome.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    /**
     * Reinicia todos os valores das perícias para o padrão e limpa os perfis salvos.
     * (Do segundo código)
     */
    function resetarTudo() {
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            const resultadoDiv = document.getElementById(`resultado-${index}`);

            if (inputPericia) inputPericia.value = "50";
            if (resultadoDiv) {
                resultadoDiv.textContent = "";
                resultadoDiv.className = 'resultado';
            }
        });
        localStorage.removeItem('perfil1');
        localStorage.removeItem('perfil2');
        localStorage.removeItem('perfil3');
        localStorage.removeItem('perfilAtual');
        exibirMensagem("Todos os perfis e valores resetados!", 'info');
        if (searchInput) searchInput.value = '';
        filterPericias();
    }

    /**
     * Gera os cards de perícia no container de perícias.
     * (Do segundo código)
     */
    function gerarPericiasNoHTML() {
        if (!periciasContainer) {
            console.error("periciasContainer não encontrado ao tentar gerar perícias.");
            return;
        }
        periciasContainer.innerHTML = '';
        periciasLista.forEach((periciaNome, index) => {
            const periciaDiv = document.createElement('div');
            periciaDiv.classList.add('pericia-item');
            periciaDiv.dataset.periciaNome = periciaNome.toLowerCase();

            periciaDiv.innerHTML = `
                <label for="pericia-${index}">${periciaNome}:</label>
                <input type="number" id="pericia-${index}" value="50" min="1" max="100">
                <button data-pericia-index="${index}">Rolar d100</button>
                <div class="resultado" id="resultado-${index}"></div>
            `;
            periciasContainer.appendChild(periciaDiv);

            // Adiciona event listeners para salvar o perfil atual ao alterar inputs
            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                inputPericia.addEventListener('change', salvarPerfilAtual);
                inputPericia.addEventListener('keyup', salvarPerfilAtual);
            }
        });
    }


    // --- FUNÇÕES DE INICIALIZAÇÃO DE SEÇÕES ---

    /**
     * Cria e injeta a estrutura das seções principais (Perícias e Status) no DOM.
     * As referências para os elementos internos são obtidas APÓS a criação.
     * Modificado para usar o `statusScreen` existente.
     */
    function initializeSections() {
        // Seção de Perícias
        periciasView = document.createElement('div');
        periciasView.id = 'periciasView';
        periciasView.classList.add('content-section', 'screen'); // Adicionado 'screen' para compatibilidade
        periciasView.innerHTML = `
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Pesquisar perícia...">
            </div>
            <section class="pericias-container"></section>
            <div class="botoes-globais">
                <button id="resetarBtn">Reiniciar Teste</button>
            </div>
        `;
        appContentArea.appendChild(periciasView);

        // O 'statusScreen' já existe no HTML e será o 'statusView'
        statusView = statusScreen; // Atribui a referência

        // IMPORTANTE: Obtém as referências dos elementos internos APÓS serem injetados no DOM
        searchInput = periciasView.querySelector('#searchInput');
        periciasContainer = periciasView.querySelector('.pericias-container');
        resetarBtn = periciasView.querySelector('#resetarBtn');
    }

    // --- CONFIGURAÇÃO DE EVENT LISTENERS ---

    function setupEventListeners() {
        // Eventos do menu de criação de personagem (do primeiro código)
        openMenuButton.addEventListener('click', () => {
            showScreen(characterCreationMenu); // Mostra a tela de criação ao clicar em 'Começar'
            // A classe 'open' é adicionada dentro de showScreen agora para melhor controle
        });

        nextToRaceButton.addEventListener('click', () => {
            const charName = characterNameInput.value.trim();
            if (charName) {
                currentCharacter.name = charName;
                // A classe 'open' é removida dentro de showScreen ao mudar de tela
                showScreen(raceSelectionScreen);
            } else {
                alert('Por favor, digite o nome do personagem!');
            }
        });

        raceButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Remove a classe 'selected' de todos os botões de raça
                raceButtons.forEach(btn => btn.classList.remove('selected'));
                // Adiciona a classe 'selected' ao botão clicado
                event.target.classList.add('selected');

                currentCharacter.race = event.target.dataset.race;
                // Torna a div attribute-choice visível ao selecionar a raça
                attributeChoiceDiv.classList.remove('hidden');
                rolledAttributesDiv.innerHTML = '';
                rolledAttributesDiv.classList.add('hidden');
                nextToStatusButton.classList.add('hidden');
            });
        });

        rollDiceButton.addEventListener('click', () => {
            const selectedRace = currentCharacter.race;
            if (selectedRace) {
                const attributesToRoll = raceAttributes[selectedRace];
                let rolled = {};
                rolledAttributesDiv.innerHTML = '<h3>Atributos Rolados:</h3><ul>';
                for (const attr in attributesToRoll) {
                    const value = rollDice(attributesToRoll[attr]);
                    rolled[attr] = value;
                    rolledAttributesDiv.innerHTML += `<li>${attr}: ${value}</li>`;
                }
                rolledAttributesDiv.innerHTML += '</ul>';
                rolledAttributesDiv.classList.remove('hidden');
                nextToStatusButton.classList.remove('hidden');
                currentCharacter.attributes = rolled;
            } else {
                alert('Por favor, selecione uma raça primeiro!');
            }
        });

        manualAttributesButton.addEventListener('click', () => {
            alert('Funcionalidade de entrada manual de atributos em desenvolvimento...');
        });

        nextToStatusButton.addEventListener('click', () => {
            displayName.textContent = currentCharacter.name;
            displayRace.textContent = currentCharacter.race;
            displayForca.textContent = currentCharacter.attributes.Força || 0;
            displayVigor.textContent = currentCharacter.attributes.Vigor || 0;
            displayAgilidade.textContent = currentCharacter.attributes.Agilidade || 0;
            displayInteligencia.textContent = currentCharacter.attributes.Inteligencia || 0;
            displaySabedoria.textContent = currentCharacter.attributes.Sabedoria || 0;
            displaySorte.textContent = currentCharacter.attributes.Sorte || 0;
            displayCarisma.textContent = currentCharacter.attributes.Carisma || 0;
            displayTamanho.textContent = currentCharacter.attributes.Tamanho || 0;
            displayAparencia.textContent = currentCharacter.attributes.Aparencia || 0;
            showScreen(statusView); // Usa o statusView (que é o statusScreen)

            // <--- ADICIONE ESTA LINHA AQUI
            mainFloatingBtn.style.display = 'flex'; // Torna o botão flutuante visível
        });

        // Eventos do painel de perfis (do segundo código)
        togglePerfisBtn.addEventListener('click', togglePerfisVisibility);
        configPerfisWrapper.addEventListener('click', (event) => {
            if (event.target === configPerfisWrapper) {
                togglePerfisVisibility();
            }
        });

        // Eventos dos botões de salvar/carregar perfil (do segundo código)
        salvarPerfil1Btn.addEventListener('click', () => salvarPericiasEmPerfil('perfil1'));
        carregarPerfil1Btn.addEventListener('click', () => {
            const loaded = carregarPericiasDePerfil('perfil1');
            if (Object.keys(loaded).length > 0) {
                aplicarPericiasCarregadas(loaded);
                exibirMensagem("Perfil 1 carregado!", 'sucesso');
            } else {
                exibirMensagem("Perfil 1 vazio! Salve primeiro.", 'fracasso');
            }
        });

        salvarPerfil2Btn.addEventListener('click', () => salvarPericiasEmPerfil('perfil2'));
        carregarPerfil2Btn.addEventListener('click', () => {
            const loaded = carregarPericiasDePerfil('perfil2');
            if (Object.keys(loaded).length > 0) {
                aplicarPericiasCarregadas(loaded);
                exibirMensagem("Perfil 2 carregado!", 'sucesso');
            } else {
                exibirMensagem("Perfil 2 vazio! Salve primeiro.", 'fracasso');
            }
        });

        salvarPerfil3Btn.addEventListener('click', () => salvarPericiasEmPerfil('perfil3'));
        carregarPerfil3Btn.addEventListener('click', () => {
            const loaded = carregarPericiasDePerfil('perfil3');
            if (Object.keys(loaded).length > 0) {
                aplicarPericiasCarregadas(loaded);
                exibirMensagem("Perfil 3 carregado!", 'sucesso');
            } else {
                exibirMensagem("Perfil 3 vazio! Salve primeiro.", 'fracasso');
            }
        });

        // Eventos da barra de pesquisa e botão de resetar (do segundo código)
        if (searchInput) {
            searchInput.addEventListener('keyup', filterPericias);
            searchInput.addEventListener('change', filterPericias);
        }
        if (resetarBtn) {
            resetarBtn.addEventListener('click', resetarTudo);
        }

        // Event listener para os botões de "Rolar d100" (delegação de evento no container) (do segundo código)
        if (periciasContainer) {
            periciasContainer.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-pericia-index')) {
                    const index = event.target.dataset.periciaIndex;
                    const inputPericia = document.getElementById(`pericia-${index}`);
                    const resultadoDiv = document.getElementById(`resultado-${index}`);

                    if (inputPericia && resultadoDiv) {
                        const valorPericia = inputPericia.value;
                        const rolagem = rolarD100();
                        const resultado = determinarResultado(valorPericia, rolagem);

                        resultadoDiv.textContent = `Rolagem: ${rolagem} - ${resultado.tipo}`;
                        resultadoDiv.className = `resultado ${resultado.classe}`;

                        salvarPerfilAtual();
                    }
                }
            });
        }

        // Eventos do botão flutuante de navegação (do segundo código)
        mainFloatingBtn.addEventListener('click', (event) => {
            floatingNav.classList.toggle('active');
            event.stopPropagation();
        });

        document.addEventListener('click', (event) => {
            if (!floatingNav.contains(event.target) && floatingNav.classList.contains('active')) {
                floatingNav.classList.remove('active');
            }
        });

        // Adaptação dos botões de navegação para usar `showScreen`
        showPericiasBtn.addEventListener('click', () => showScreen(periciasView));
        showStatusBtn.addEventListener('click', () => showScreen(statusView));
    }

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    initializeSections(); // 1. Cria as estruturas das views (perícias e status)
    gerarPericiasNoHTML(); // 2. Popula a view de perícias (requer periciasContainer existente)
    setupEventListeners(); // 3. Configura todos os ouvintes de evento (requer elementos existirem)

    // Carrega o perfil inicial (se houver) e mostra a tela de boas-vindas
    carregarPerfilInicial();
    showScreen(welcomeScreen); // Inicia na tela de boas-vindas
});
